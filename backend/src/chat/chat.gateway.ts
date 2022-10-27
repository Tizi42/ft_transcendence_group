import { ConnectedSocket, MessageBody, SubscribeMessage } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ChannelService } from 'src/channel/channel.service';
import { AppGateway } from '../gateway';
import { UsersService } from '../users/users.service';
import { ChatService } from './chat.service';
import { emojiInfo, messageInfos, messageInGame } from './utils/types';
import { BattlesService } from '../battles/battles.service';
import { ChannelMessage } from './utils/types';
import { Chat } from './entities/chat.entity';

export class ChatGateway extends AppGateway {

  constructor(
    readonly chatService: ChatService,
    readonly usersService: UsersService,
    readonly channelService: ChannelService,
    readonly battlesService: BattlesService
  ) {
    super(chatService, usersService, channelService, battlesService);
  }

  async handleConnection() {}

  async handleDisconnect() {}

  @SubscribeMessage('send_message')
  async handleMessage(
    @MessageBody() data: messageInfos,
    @ConnectedSocket() socket: Socket,
  ): Promise<Chat> {
    const user = await this.chatService.getUserFromSocket(socket);

    if (!user) {
      return ;
    }
    const message = await this.chatService.saveMessage(data);

    this.server.sockets.to(data.destId.toString()).to(socket.data.id.toString()).emit('receive_message');
    this.server.sockets.to(data.destId.toString()).emit('receive_message_notification', socket.data.id);

    return message;
  }

  @SubscribeMessage('send_channel_message')
  async handleChannelMessage(
    @MessageBody() data: ChannelMessage,
    @ConnectedSocket() socket: Socket,
  ): Promise<Chat> {
    const user = await this.chatService.getUserFromSocket(socket);
    const channel = await this.channelService.findOne(data.channelId);

    if (
      !user ||
      user.id != data.authorId ||
      !channel ||
      channel.muted.includes(data.authorId, 0) ||
      channel.banned.includes(data.authorId, 0)
    ) {
      return ;
    }
    const message = await this.chatService.saveChannelMessage(data, user);

    this.server.sockets.to(channel.name).emit('receive_channel_message');
    this.server.sockets.to(channel.name).emit('receive_channel_notification', user.id, channel.id);
    
    return message;
  }

  @SubscribeMessage('send_message_ingame')
  async handleMessageNotSave(
    @MessageBody() data: messageInGame,
  ) {
    this.server.sockets.to(data.dest).to(data.author).emit('receive_message_ingame', data);
  }

  @SubscribeMessage('send_emoji_ingame')
  async sendEmojiInGame(
    @MessageBody() data: emojiInfo,
  ) {
    this.server.sockets.to(data.dest).to(data.author).emit('receive_emoji_ingame', data);
  }
  
  @SubscribeMessage("logout_all")
  async handleLogout() {}
}
