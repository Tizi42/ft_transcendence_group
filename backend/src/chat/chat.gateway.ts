import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, } from '@nestjs/websockets';
import { Server } from 'socket.io';
   
@WebSocketGateway({
    cors: {
        origin: '*',
  },
})

export class ChatGateway {
    @WebSocketServer()
    server: Server;
    
    @SubscribeMessage('send_message')
    listenForMessages(@MessageBody() data: string) {
        console.log('back');
        // envoi d'un message au client = socket.emit 
        this.server.sockets.emit('receive_message', data);
    }
}