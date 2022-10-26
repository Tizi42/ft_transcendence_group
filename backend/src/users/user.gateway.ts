import { ConnectedSocket, MessageBody, SubscribeMessage } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ChannelService } from 'src/channel/channel.service';
import { AppGateway } from '../gateway';
import { UsersService } from './users.service';
import { ChatService } from '../chat/chat.service';
import { BattlesService } from '../battles/battles.service';
import { FriendShip, RemoveNotif, RemoveNotifChannel } from './utils/types';

export class UserGateway extends AppGateway {

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

  /*
  **    USER SETTINGS
  */

  @SubscribeMessage('change_notification_settings')
  async onChangeNotificationSettings(@ConnectedSocket() socket: Socket, @MessageBody() data: boolean) {
    const user = await this.chatService.getUserFromSocket(socket);
    await this.usersService.changeSettingNotification(user.id, data);
    this.server.sockets.to(socket.id).emit('notification_settings_changed', data);
  }

  /*
  **    USER NOTIFICATION
  */

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

  @SubscribeMessage('remove_chat_notification')
  async ignoreChatNotifcation(
    @ConnectedSocket() socket: Socket
  ) {
    this.server.sockets.to(socket.id).emit('ignore_chat_notification');
  }

  @SubscribeMessage('update_friend')
  async onFriendAccept(@MessageBody() data: FriendShip) {
    this.server.sockets.to(data.from).to(data.to).emit('friend_update');
  }

  @SubscribeMessage('remove_private_notif')
  async handleRemovePrivateNotif(
    @MessageBody() data: RemoveNotif,
    @ConnectedSocket() socket: Socket
  ) {
    const user = await this.chatService.getUserFromSocket(socket);

    if (!user) {
      return ;
    }
    this.server.sockets.to(socket.data.id.toString()).emit('ignore_private_notif', data.receiverId);
  }

  @SubscribeMessage('remove_channel_notif')
  async handleRemoveChannelNotif(
    @MessageBody() data: RemoveNotifChannel,
    @ConnectedSocket() socket: Socket
  ) {
    const user = await this.chatService.getUserFromSocket(socket);

    if (!user) {
      return ;
    }
    this.server.sockets.to(socket.data.id.toString()).emit('ignore_channel_notif', data.selectedChannelId);
  }
}
