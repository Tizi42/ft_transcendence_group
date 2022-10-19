import { ConnectedSocket, MessageBody, SubscribeMessage } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { FriendShip } from 'src/users/utils/types';
import { ChannelService } from 'src/channel/channel.service';
import { AppGateway } from '../gateway';
import { UsersService } from '../users/users.service';
import { ChatService } from './chat.service';
import { ChannelMessage, emojiInfo } from './utils/types';

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

  @SubscribeMessage('send_channel_message')
  async handleChannelMessage(
    @MessageBody() data: ChannelMessage,
    @ConnectedSocket() socket: Socket,
  ) {
    const user = await this.chatService.getUserFromSocket(socket);
    const channel = await this.channelService.findOne(data.channelId);

    if (!user || user.id != data.authorId || !channel || channel.muted.includes(data.authorId, 0)) {
      return ;
    }
    const message = await this.chatService.saveChannelMessage(data, user);

    this.server.sockets.to(channel.name).emit('receive_channel_message');
    
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

  @SubscribeMessage('request_friendship')
  async handleFriendship(
    @MessageBody() data: FriendShip,
  ) {
    this.server.sockets.to(data.to).emit('receive_friendship', data);
  }

  @SubscribeMessage('remove_notification')
  async ignoreNotifcation(
    @ConnectedSocket() socket: Socket
  ) {
    this.server.sockets.to(socket.id).emit('ignore_notification');
  }
}
