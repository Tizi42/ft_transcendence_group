import { MessageBody, SubscribeMessage, ConnectedSocket } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GameRoom } from "./utils/game";
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
    magic: -1
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
      GameGateway.rooms.set(room_name, new GameRoom(playerL, data.user_id));
      this.server.in(data.user_id).in(playerL).socketsJoin(room_name);
      this.server.to(data.user_id).to(playerL).emit("game_found", room_name);
    }

      // if (!GameGateway.queues.has(socketId)) {
      //     GameGateway.queues.set(socketId, data.mode);
      // }
      // this.server.sockets.emit('searching');
      // for (let user of GameGateway.queues.keys()) {
      //     let m = GameGateway.queues.get(user)
      //     if (user != socketId && data.mode == m) {
      //         const room_name = socketId + " vs " + user;
      //         var game = new GameRoom();
      //         game.room_name = room_name;
      //         game.server = this.server;
      //         game.mode = m;
      //         game.player1 = socketId;
      //         game.player2 = user;

      //         GameGateway.queues.delete(socketId);
      //         GameGateway.queues.delete(user);
      //     }
      // }
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

  @SubscribeMessage('ready')
  async onPlayerReady(@ConnectedSocket() socket: Socket, @MessageBody() data: any) {
    const room = GameGateway.rooms.get(data.room_name);
    if (!room || (data.user_id !== room.playerL && data.user_id !== room.playerR)
        || room.ready === data.user.id)
      return null;
    if (room.ready === 0)
      room.ready = data.user_id;
    else {
      this.server.to(data.room_name).emit("game_start");
    }
  }

  @SubscribeMessage('update_pos')
  async updatePaddle(socket: Socket, data: any) {
      const socketId = socket.id;
      console.log(socketId);
      console.log(data[0]);
      console.log(data[1]);
      console.log(data);
      GameGateway.rooms.get(data[0]).update_gamestate(socketId, data[1]);
  }
}