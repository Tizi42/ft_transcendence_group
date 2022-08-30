import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ChatService } from './chat.service';
import { Inject } from '@nestjs/common';
import { messageInfos } from './utils/types';
   
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

    @SubscribeMessage('send_message')
    listenForMessages(@MessageBody() data: messageInfos) {
    
        console.log('Message from: ' + data.author);
        console.log('who says: ' + data.content);
    
        this.chatService.saveMessage(data);
        // envoi d'un message au client = socket.emit 
        this.server.sockets.emit('receive_message', data);
    }
}