import { ConnectedSocket, MessageBody, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AppGateway } from 'src/gateway';
import { UsersService } from 'src/users/users.service';
import { ChatService } from './chat.service';

export class ChatGateway extends AppGateway {

  constructor(
    readonly chatService: ChatService,
    readonly usersService: UsersService,
  ) {
    super(chatService, usersService);
  }

  async handleConnection(socket: Socket) {}

  handleDisconnect(client: any) {}

  @SubscribeMessage('send_message')
  async handleMessage(
    @MessageBody() data: any,
    @ConnectedSocket() socket: Socket,
  ) {
    const message = await this.chatService.saveMessage(data);

    for (let [id, socket] of this.server.of("/").sockets) {
      if (socket.data) {
        if (socket.data.id === data.dest) {
          this.server.sockets.to(id).emit('receive_message');
        }
        if (socket.data.id === data.author) {
          this.server.sockets.to(id).emit('receive_message');
        }
      }
    }

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
