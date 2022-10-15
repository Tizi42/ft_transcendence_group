import { MessageBody, SubscribeMessage, ConnectedSocket } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GameRoomNS } from "./utils/gameNS";
import { GameRoom } from "./utils/gameRoom";
import { AppGateway } from '../gateway';
import { UsersService } from '../users/users.service';
import { GameService } from './game.service';
import { ChatService } from '../chat/chat.service';
import { ChannelService } from 'src/channel/channel.service';

export class GameGateway extends AppGateway {

  constructor(
    readonly chatService: ChatService,
    readonly usersService: UsersService,
    readonly channelService: ChannelService,
    readonly gameService: GameService,
  ) {
    super(chatService, usersService, channelService);
  }

  async handleConnection(socket: Socket) {}

  handleDisconnect(client: any) {}

  private static queues = {
    normal: {
      id: -1,
      sid: "",
    },
    magic: {
      id: -1,
      sid: "",
    }
  };
  private static rooms: Map<string, GameRoom> = new Map(); //roomName, GameRoom
  private static participants: Map<string, string> = new Map(); //socketId, roomName

  createGameRoom(
    l_id: number,
    l_sid: string,
    r_id: number,
    r_sid:string,
    mode: string
  ) {
    const room_name = l_id + " vs " + r_id;
    GameGateway.rooms.set(room_name, new GameRoom(l_id, l_sid, r_id, r_sid, mode));
    // update user status
    this.usersService.updateUserStatus(l_id, "in game");
    this.usersService.updateUserStatus(r_id, "in game");
    // annonce to given socket
    this.server.in(l_sid).in(r_sid).socketsJoin(room_name);
    this.server.to(l_sid).to(r_sid).emit("game_found", room_name);
  }

  cleanQueue(mode: string) {
    GameGateway.queues[mode].id = -1;
    GameGateway.queues[mode].sid = "";
  }

  @SubscribeMessage('queue_register')
  queueRegister(@ConnectedSocket() socket: Socket, @MessageBody() data: any) {
    console.log("Queue register received: ", data);
    if (GameGateway.queues.normal.id === data.user_id
        || GameGateway.queues.magic.id === data.user_id) {
      return "Already in a queue!";
    }

    let playerL = GameGateway.queues[data.mode];
    if (playerL.id === -1) {
      GameGateway.queues[data.mode].id = data.user_id;
      GameGateway.queues[data.mode].sid = socket.id;
      return "Waiting for another player...";
    } else {
      this.createGameRoom(playerL.id, playerL.sid, data.user_id, socket.id, data.mode);
      this.cleanQueue(data.mode);
    }
  }

  @SubscribeMessage('quit_queue')
  quitQueue(@ConnectedSocket() socket: Socket, @MessageBody() data: any) {
    console.log("Quit queue received: ", data);
    if (GameGateway.queues[data.mode].id === data.user_id)
      this.cleanQueue(data.mode);
    return "You are no longer in queue";
  }

  @SubscribeMessage('init_room')
  async sendRoomInfo(@ConnectedSocket() socket: Socket, @MessageBody() data: any) {
    const room = GameGateway.rooms.get(data.room_name);
    if (!room)
      return null;
    if (data.user_id !== room.playerL && data.user_id !== room.playerR)
      this.server.in(socket.id).socketsJoin(data.room_name);
    return room;
  }

  @SubscribeMessage('leave_game')
  async onLeavingRoom(@ConnectedSocket() socket: Socket, @MessageBody() data: any) {
    const room = GameGateway.rooms.get(data.room_name);
    if (!room)
      return null;
    if (data.user_id !== room.playerL && data.user_id !== room.playerR) {
      this.server.in(socket.id).socketsLeave(data.room_name);
    } else {
      socket.to(data.room_name).emit("quit_game");
      this.server.in(data.room_name).socketsLeave(data.room_name);
      this.usersService.updateUserStatus(room.playerL, "online");
      this.usersService.updateUserStatus(room.playerR, "online");
      GameGateway.rooms.delete(data.room_name);

    }
  }

  @SubscribeMessage('ready')
  async onPlayerReady(@MessageBody() data: any) {
    const room = GameGateway.rooms.get(data.room_name);
    console.log(data.user_id, " is ready");
    if (!room || (data.user_id !== room.playerL && data.user_id !== room.playerR)
        || room.ready === data.user_id)
      return null;
    if (room.ready === 0)
      room.ready = data.user_id;
    else {
      room.ready = 0;
      this.server.to(data.room_name).emit("game_start");
    }
  }

  @SubscribeMessage('cancel_ready')
  async onCancelReady(@MessageBody() data: any) {
    const room = GameGateway.rooms.get(data.room_name);
    if (!room)
      return null;
    if (room.ready === data.user_id)
      room.ready = 0;
  }

  @SubscribeMessage('update_paddle')
  async onUpdatePaddle(@MessageBody() data: any) {
    const room = GameGateway.rooms.get(data.room_name);
    if (!room)
      return null;
    if (room.playerL === data.user_id) {
      room.paddle_left_pos_y = data.paddle_pos;
    } else if (room.playerR === data.user_id) {
      room.paddle_right_pos_y = data.paddle_pos;
    }
    this.server.to(data.room_name).emit("game_update", {
      paddle_left_posY: room.paddle_left_pos_y,
      paddle_right_posY: room.paddle_right_pos_y,
    });
  }

  @SubscribeMessage('ball_pos')
  async updateBallPos(@ConnectedSocket() socket: Socket, @MessageBody() data: any) {
    // const room = GameGateway.rooms.get(data.room_name);
    // if (!room)
    //   return null;
    // room.ball_pos_x = data.ball_x;
    // room.ball_pos_y = data.ball_y;
    socket.to(data.room_name).emit("ball_update", {
      ball_x: data.ball_x,
      ball_y: data.ball_y,
      vx: data.vx,
      vy: data.vy,
    });
  }

  @SubscribeMessage('update_score')
  async onUpdateScore(@MessageBody() data: any) {
    console.log(GameGateway.rooms);
    console.log("score:", data);
    this.server.to(data.room_name).emit("score_update", {
      left: data.left,
      right: data.right,
    });
  }

  getRandomInt(max: number = 100) : number {
    return Math.floor(Math.random() * max);
  }

  transformRooms(): Array<GameRoomNS> {
    let data: Array<GameRoomNS> = [];
    const modes: string[] = ["normal", "speed", "magic"]; // to change when mode will be set up
    GameGateway.rooms.forEach((value: GameRoom, key: string) => {
      data.push(new GameRoomNS(value, key));
    });
    console.log(data);
    return data;
  }

  @SubscribeMessage('get_updated_rooms')
  updateRooms(@ConnectedSocket() socket: Socket) {
    if (GameGateway.rooms.size == 0) { // to delete when everything is good
      let room_name = 2 + " vs " + 3;
      GameGateway.rooms.set(room_name, new GameRoom(2, "", 3, "", "normal",));
      room_name = 4 + " vs " + 5;
      GameGateway.rooms.set(room_name, new GameRoom(4, "", 5, "", "magic"));
      room_name = 6 + " vs " + 7;
      GameGateway.rooms.set(room_name, new GameRoom(6, "", 7, "", "speed"));
    }
    this.server.to(socket.id).emit("updated_rooms", this.transformRooms());
  }

  @SubscribeMessage('reset_score')
  async onResetScore(@ConnectedSocket() socket: Socket) {
    this.server.to(socket.id).emit("score_update", {
      left: 0,
      right: 0,
    });
  }

  @SubscribeMessage('game_end')
  async onGameEnd(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: any
  ){
    console.log("game end, winner is player ", data.winner);

    const room = GameGateway.rooms.get(data.room_name);

    if (!room)
      return null;

    // save game data
    room.score_left = data.left;
    room.score_right = data.right;
    if (data.winner === "left")
      room.winner = room.playerL;
    else if (data.winner === "right")
      room.winner = room.playerR;

    //update battle history database

    // inform other users in game room
    socket.to(data.room_name).emit("end", {
      winner: data.winner,
    });
  }

  // @SubscribeMessage('update_pos')
  // async updatePaddle(socket: Socket, data: any) {
  //     const socketId = socket.id;
  //     console.log(socketId);
  //     console.log(data[0]);
  //     console.log(data[1]);
  //     console.log(data);
  //     GameGateway.rooms.get(data[0]).update_gamestate(socketId, data[1]);
  // }
}