import { MessageBody, SubscribeMessage, ConnectedSocket } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GameRoom } from "./utils/gameRoom";
import { AppGateway } from '../gateway';
import { UsersService } from '../users/users.service';
import { GameService } from './game.service';
import { ChatService } from '../chat/chat.service';

export class GameGateway extends AppGateway {

  constructor(
    readonly gameService: GameService,
    readonly chatService: ChatService,
    readonly usersService: UsersService,
  ) {
    super(chatService, usersService);
  }

  async handleConnection(socket: Socket) {}

  handleDisconnect(client: any) {}

  private static queues = {
    normal: -1,
    magic: -1,
  };
  private static rooms: Map<string, GameRoom> = new Map(); //roomName, GameRoom
  private static participants: Map<string, string> = new Map(); //socketId, roomName

  @SubscribeMessage('queue_register')
  queueRegister(@ConnectedSocket() socket: Socket, @MessageBody() data: any) {
    console.log("Queue register received: ", data);
    if (GameGateway.queues.normal === data.user_id
        || GameGateway.queues.magic === data.user_id) {
      return "Already in a queue!";
    }

    let playerL = GameGateway.queues[data.mode];
    if (playerL === -1) {
      GameGateway.queues[data.mode] = data.user_id;
      return "Waiting for another player...";
    } else {
      GameGateway.queues[data.mode] = -1;
      const room_name = playerL + " vs " + data.user_id;
      GameGateway.rooms.set(room_name, new GameRoom(playerL, data.user_id, data.mode));
      const room = GameGateway.rooms.get(room_name);
      console.log("room value in queue", room);
      this.server.in(data.user_id).in(playerL).socketsJoin(room_name);
      this.server.to(data.user_id).to(playerL).emit("game_found", room_name);
    }
  }

  @SubscribeMessage('quit_queue')
  quitQueue(@ConnectedSocket() socket: Socket, @MessageBody() data: any) {
    console.log("Quit queue received: ", data);
    if (GameGateway.queues.normal === data.user_id)
      GameGateway.queues.normal = -1;
    if (GameGateway.queues.magic === data.user_id)
      GameGateway.queues.magic = -1;
    return "You are no longer in queue";
  }

  @SubscribeMessage('init_room')
  async sendRoomInfo(@ConnectedSocket() socket: Socket, @MessageBody() data: any) {
    const room = GameGateway.rooms.get(data.room_name);
    if (!room)
      return null;
    if (data.user_id !== room.playerL && data.user_id !== room.playerR)
      this.server.in(data.user_id).socketsJoin(data.room_name);
    return room;
  }

  @SubscribeMessage('leave_game')
  async onLeavingRoom(@ConnectedSocket() socket: Socket, @MessageBody() data: any) {
    const room = GameGateway.rooms.get(data.room_name);
    if (!room)
      return null;
    if (data.user_id !== room.playerL && data.user_id !== room.playerR) {
      this.server.in(data.user_id).socketsLeave(data.room_name);
    } else {
      socket.to(data.room_name).emit("quit_game");
      this.server.in(data.user_id).socketsLeave(data.room_name);
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
    console.log("score:", data);
    this.server.to(data.room_name).emit("score_update", {
      left: data.left,
      right: data.right,
    });
  }

  @SubscribeMessage('reset_score')
  async onResetScore(@MessageBody() data: any) {
    this.server.to(data.user_id).emit("score_update", {
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