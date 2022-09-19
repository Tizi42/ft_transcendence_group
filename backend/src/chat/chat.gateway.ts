import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer, } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Inject } from '@nestjs/common';
import { messageInfos } from './utils/types';
import { ChatService } from './chat.service';
   
@WebSocketGateway({
    cors: {
        origin: '*',
        credentials: true,
        methods: ["GET", "POST"],
  },
})

export class ChatGateway implements OnGatewayConnection {
    @WebSocketServer()
    server: Server;

    constructor(
        private readonly chatService: ChatService,
      ) {}

    async handleConnection(socket: Socket) {
        const users = [];
    
        await this.chatService.getUserFromSocket(socket);
        for (let [id, socket] of this.server.of("/").sockets) {
          users.push({
            userID: id,
            username: socket.data.username,
          });
        }
        socket.emit('users', users);
    }

    @SubscribeMessage('request_all_users')
    async requestAllUsers(socket: Socket) {
        const users = [];

        await this.chatService.getUserFromSocket(socket);
        for (let [id, socket] of this.server.of("/").sockets) {
        users.push({
            userID: id,
            username: socket.data.username,
        });
        }
        socket.emit('users', users);
    }

    @SubscribeMessage('send_message')
    async listenForMessages(@ConnectedSocket() socket: Socket,
    @MessageBody() data: messageInfos) {
        const author = await this.chatService.getUserFromSocket(socket);
        console.log('socket: ', author);

        console.log('Message from: ');
        console.log(data.author);
        console.log('who says: ' + data.content);
        data.author = author;
        console.log('Message from: ');
        console.log(data.author);
        this.chatService.saveMessage(data);
        this.server.sockets.emit('receive_message', data);
    };
}