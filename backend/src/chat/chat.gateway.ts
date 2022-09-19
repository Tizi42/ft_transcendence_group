import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Inject } from '@nestjs/common';
import { messageInfos } from './utils/types';
import { ChatService } from './chat.service';
import { UsersService } from 'src/users/users.service';
   
@WebSocketGateway({
    cors: {
        origin: '*',
  },
})

export class ChatGateway {
    @WebSocketServer()
    server: Server;

    @Inject(ChatService)
    private readonly chatService: ChatService;

    @Inject(UsersService)
    private userService: UsersService;

    @SubscribeMessage('send_message')
    listenForMessages(@MessageBody() data: messageInfos) {
        
        console.log('Message from: ');
        console.log(data.author);
        console.log('who says: ' + data.content);
        this.chatService.saveMessage(data);
        this.server.sockets.emit('receive_message', data);
    };
}