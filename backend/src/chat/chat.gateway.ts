import { ConnectedSocket, MessageBody, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChannelService } from 'src/channel/channel.service';
import { AppGateway } from 'src/gateway';
import { UsersService } from 'src/users/users.service';
import { ChatService } from './chat.service';

export class ChatGateway extends AppGateway {

  constructor(
    readonly chatService: ChatService,
    readonly usersService: UsersService,
    readonly channelService: ChannelService,
  ) {
    super(chatService, usersService);
  }

  async handleConnection(socket: Socket) {}

  handleDisconnect(client: any) {}

  @SubscribeMessage('create_channel')
  async createChannel(
    @MessageBody() data: any,
    @ConnectedSocket() socket: Socket,
  ) {
    const channel = await this.channelService.createChannel(data);

    return channel;
  }

  @SubscribeMessage('send_message')
  async handleMessage(
    @MessageBody() data: any,
    @ConnectedSocket() socket: Socket,
  ) {
    const message = await this.chatService.saveMessage(data);

    this.server.sockets.to(data.dest).to(data.author).emit('receive_message');

    return message;
  }

  // @SubscribeMessage('last_from')
  // async lastFrom(@MessageBody() id: number) {
  //   const messages = await this.chatService.getMessagesById(id);
  //   const last = messages[messages.length - 1];
  //     return last;
  // }

  // @SubscribeMessage('request_all_messages')
  // async requestAllMessages(@ConnectedSocket() socket: Socket) {
  //   await this.chatService.getUserFromSocket(socket);

  //   return await this.chatService.getAllMessages();
  // }
}
