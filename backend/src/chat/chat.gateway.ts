import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

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
    const messages = await this.chatService.getAllMessages();

    socket.emit('send_all_messages', messages);
  }
}
