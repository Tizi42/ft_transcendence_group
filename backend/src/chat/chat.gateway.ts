import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { messageInfos } from './utils/types';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:8080',
    methods: ["GET", "POST"],
    credentials: true,
  },
})

export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
  ) {}

  async handleConnection(socket: Socket) {
    console.log("socket io id = ", socket.id);

    // this.server.sockets.emit('new_connection');
  }

  @SubscribeMessage('send_message')
  async handleMessage(
    @MessageBody() data: messageInfos,
    @ConnectedSocket() socket: Socket,
  ) {
    // console.log('Message from: ');
    // console.log(data.author);
    // console.log('who says: ' + data.content);
    // console.log('Message from: ');
    // console.log(data.author);
    const message = this.chatService.saveMessage(data);

    this.server.sockets.emit('receive_message');

    return message;
  }

  @SubscribeMessage('last_from')
  async lastFrom(@MessageBody() id: number) {
    const messages = await this.chatService.getMessagesById(id);
    const last = messages[messages.length - 1];
      return last;
  }

  // @SubscribeMessage('request_all_messages')
  // async requestAllMessages(@ConnectedSocket() socket: Socket) {
  //   await this.chatService.getUserFromSocket(socket);

  //   return await this.chatService.getAllMessages();
  // }
}
