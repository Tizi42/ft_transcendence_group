import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer, } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { messageInfos } from './utils/types';
import { ChatService } from './chat.service';
import { Res } from '@nestjs/common';
   
@WebSocketGateway({
    cors: {
        origin: '*',
        credentials: true,
  },
})

export class ChatGateway  {
    // implements OnGatewayConnection
    @WebSocketServer()
    server: Server;

    constructor(
        private readonly chatService: ChatService,
      ) {}

    // async handleConnection(socket: Socket) {
    //     const users = [];
    
    //     await this.chatService.getUserFromSocket(socket);
    //     for (let [id, socket] of this.server.of("/").sockets) {
    //       users.push({
    //         userID: id,
    //         username: socket.data.username,
    //       });
    //     }
    //     socket.emit('users', users);
    // }

    // @SubscribeMessage('request_all_users')
    // async requestAllUsers(socket: Socket) {
    //     const users = [];

    //     await this.chatService.getUserFromSocket(socket);
    //     for (let [id, socket] of this.server.of("/").sockets) {
    //     users.push({
    //         userID: id,
    //         username: socket.data.username,
    //     });
    //     }
    //     socket.emit('users', users);
    // }

    @SubscribeMessage('send_message')
    async listenForMessages(
    @MessageBody() data: messageInfos) {
        // @ConnectedSocket() socket: Socket,
        // const author = await this.chatService.getUserFromSocket(socket);
        // console.log('socket: ', author);

        console.log('Message from: ');
        console.log(data.author);
        console.log('who says: ' + data.content);
        // data.author = author;
        console.log('Message from: ');
        console.log(data.author);
        this.chatService.saveMessage(data);
        this.server.sockets.emit('receive_message', data);
    };

    @SubscribeMessage('last_message')
    async lastMessage(@MessageBody() id: number) {
        const messages = await this.chatService.getMessagesById(id);
        const last = messages[messages.length - 1];
        this.server.sockets.emit('receive_message', last);
        return last;
    };

    @SubscribeMessage('all_dest')
    async allDest(@Res() res) {
        const dest = await this.chatService.getAllDest();
        this.server.sockets.emit('receive_message', dest);
        return dest;
    };
}