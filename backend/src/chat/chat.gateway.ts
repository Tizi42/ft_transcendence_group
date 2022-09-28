import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer, } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { messageInfos } from './utils/types';
import { ChatService } from './chat.service';
import { UsersService } from 'src/users/users.service';
   
@WebSocketGateway({
    cors: {
        origin: 'http://localhost:8080',
        credentials: true,
  },
})

export class ChatGateway implements OnGatewayConnection {
    @WebSocketServer()
    server: Server;

    constructor(
        private readonly chatService: ChatService,
        private readonly userService: UsersService,
      ) {}

    async handleConnection(socket: Socket) {
      console.log(socket.id);
    }

    @SubscribeMessage('send_message')
    async listenForMessages(@ConnectedSocket() socket: Socket,
    @MessageBody() data: messageInfos) {
        // const author = await this.chatService.getUserFromSocket(socket);
        // console.log('socket: ', author);

        console.log('Message from: ');
        console.log(data.author);
        console.log('who says: ' + data.content);
        // data.author = author;
        console.log('Message from: ');
        console.log(data.author);
        this.chatService.saveMessage(data);
    };

    @SubscribeMessage('last_from')
    async lastFrom(@MessageBody() id: number) {
        const messages = await this.chatService.getMessagesById(id);
        const last = messages[messages.length - 1];
        return last;
    };
}
