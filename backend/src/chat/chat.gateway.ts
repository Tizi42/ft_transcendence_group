import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
  ) {}

  async handleConnection(socket: Socket) {
    console.log("Connection in Chat: ", socket.id);

    // const users = [];

    // await this.chatService.getUserFromSocket(socket);
    // for (let [id, socket] of this.server.of("/").sockets) {
    //   users.push({
    //     userID: id,
    //     username: socket.data.username,
    //   });
    // }
    // socket.emit('users', users);
    // await this.chatService.getUserFromSocket(socket);

    this.server.sockets.emit('new_connection');
  }

  @SubscribeMessage('send_message')
  async handleMessage(
    @MessageBody() content: string,
    @ConnectedSocket() socket: Socket,
  ) {
    const author = await this.chatService.getUserFromSocket(socket);
    const message = await this.chatService.saveMessage(content, author);

    this.server.sockets.emit('receive_message', message);

    return message;
  }

  @SubscribeMessage('request_all_messages')
  async requestAllMessages(@ConnectedSocket() socket: Socket) {
    await this.chatService.getUserFromSocket(socket);

    return await this.chatService.getAllMessages();
  }
}
