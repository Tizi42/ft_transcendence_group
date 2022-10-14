import { ConnectedSocket, MessageBody, SubscribeMessage } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ChannelService } from 'src/channel/channel.service';
import { AppGateway } from '../gateway';
import { UsersService } from '../users/users.service';
import { ChatService } from './chat.service';
import { emojiInfo } from './utils/types';

export class ChatGateway extends AppGateway {

  constructor(
    readonly chatService: ChatService,
    readonly usersService: UsersService,
    readonly channelService: ChannelService,
  ) {
    super(chatService, usersService, channelService);
  }

  async handleConnection(socket: Socket) {}

  handleDisconnect(client: any) {}

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

  @SubscribeMessage('send_message_ingame')
  async handleMessageNotSave(
    @MessageBody() data: any,
  ) {
    this.server.sockets.to(data.dest).to(data.author).emit('receive_message_ingame', data);
  }

  @SubscribeMessage('send_emoji_ingame')
  async sendEmojiInGame(
    @MessageBody() data: emojiInfo,
  ) {
    this.server.sockets.to(data.dest).to(data.author).emit('receive_emoji_ingame', data);
  }
}
