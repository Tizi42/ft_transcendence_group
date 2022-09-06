import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { MessagesService } from './messages.service';
import { Inject } from '@nestjs/common';
import { messageInfos } from './utils/types';
   
@WebSocketGateway({
    cors: {
        origin: '*',
  },
})

export class MessagesGateway {
    @WebSocketServer()
    server: Server;

    @Inject(MessagesService)
    private readonly messagesService: MessagesService;

    @SubscribeMessage('send_message')
    listenForMessages(@MessageBody() data: messageInfos) {

        console.log('Message from: ' + data.owner);
        console.log('who says: ' + data.message);
    
        // this.chatService.saveMessage(data);
        // envoi d'un message au client = socket.emit 
        this.server.sockets.emit('receive_message', data);
    }
}