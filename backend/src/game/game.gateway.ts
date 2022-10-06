import { MessageBody, SubscribeMessage, ConnectedSocket } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GameRoom } from "./utils/game";
import { AppGateway } from '../gateway';
import { UsersService } from '../users/users.service';
import { GameService } from './game.service';
import { ChatService } from '../chat/chat.service';
import { Module } from 'module';

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

    // handleConnection(socket: Socket): void {
    //     const socketId = socket.id;
    //     console.log("bonjour ", socketId);
    //     GameGateway.participants.set(socketId, '');
    //     if (!GameGateway.clients.has(socketId)) {
    //         GameGateway.clients.set(socketId, new Player(false));
    //     }
    // }

    // handleDisconnect(socket: Socket): void {
    //     const socketId = socket.id;
    //     const roomId = GameGateway.participants.get(socketId);
    //     const room = GameGateway.rooms.get(roomId);
    //     console.log("aurevoir ", socketId);
    //     GameGateway.participants.delete(socketId);
    //     GameGateway.clients.delete(socketId);
    //     GameGateway.queues.delete(socketId);
    // }

    // @SubscribeMessage('login')
    // async loginAttempt(socket: Socket, data: string) {
    //     const socketId = socket.id;
    //     console.log(socketId, " loged");
    //     if (!GameGateway.clients.has(socketId)) {
    //         GameGateway.clients.set(socketId, new Player(false));
    //     }
    //     if (GameGateway.clients.get(socketId).loged === false) {
    //         GameGateway.clients.get(socketId).loged = true;
    //     }
    //     this.server.sockets.emit('searching');
    // }

  @SubscribeMessage('queue_register')
  queueRegister(@ConnectedSocket() socket: Socket, @MessageBody() data: any) {
    if (GameGateway.queues.normal === data.user_id
        || GameGateway.queues.magic === data.user_id) {
      return ;
    }

    let playerL = GameGateway.queues[data.mode];
    if (playerL === -1) {
      GameGateway.queues[data.mode] = data.user_id;
      return ;
    } else {
      GameGateway.queues[data.mode] = -1;
      const room_name = playerL + " vs " + data.user_id;
      this.server.in(data.user_id).in(playerL).socketsJoin(room_name);
      this.server.to(data.user_id).to(playerL).emit("game_found", room_name);
      GameGateway.rooms.set(room_name, new GameRoom(playerL, data.user_id));
    }

      // const socketId = socket.id;
      // console.log(socketId, " i ssearching a game");
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

      //         GameGateway.participants.set(user, room_name);
      //         GameGateway.participants.set(socketId, room_name);
      //         GameGateway.rooms.set(room_name, game);

      //         GameGateway.queues.delete(socketId);
      //         GameGateway.queues.delete(user);
      //         game.start();
      //         break;
      //     }
      // }
  }

  @SubscribeMessage('init_room')
  async sendRoomInfo(@ConnectedSocket() socket: Socket, @MessageBody() data: any) {
    
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