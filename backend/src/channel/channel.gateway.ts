import { ConnectedSocket, MessageBody, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChannelService } from 'src/channel/channel.service';
import { ChatService } from 'src/chat/chat.service';
import { AppGateway } from 'src/gateway';
import { UsersService } from 'src/users/users.service';
import { banMember, leavingChannel, makingAdmin } from './utils/types';

export class ChannelGateway extends AppGateway {

  constructor(
    readonly chatService: ChatService,
    readonly usersService: UsersService,
    readonly channelService: ChannelService,
  ) {
    super(chatService, usersService, channelService);
  }

  async handleConnection(socket: Socket) {}

  handleDisconnect(client: any) {}

  @SubscribeMessage('create_channel')
  async handleCreateChannel(
    @MessageBody() data: any,
    @ConnectedSocket() socket: Socket,
  ) {
    const newChannel = await this.channelService.createChannel(data);
  
    if (newChannel) {
      socket.join(newChannel.name);
      this.server.sockets.to(socket.data.id).emit('receive_channel_created', newChannel);
    }
    return newChannel;
  }

  @SubscribeMessage('get_all_my_channels')
  async handleAllMyChannels(
    @ConnectedSocket() socket: Socket,
  ) {
    const channel = await this.channelService.getAllMyChannels(socket.data.id);

    this.server.sockets.to(socket.data.id).emit('receive_all_my_channels', channel);
    return channel;
  }

  @SubscribeMessage('join_channel')
  async joinChannel(
    @MessageBody() data: any,
    @ConnectedSocket() socket: Socket,
  ){
    await this.channelService.joinChannel(data.user, data.channel);

    this.server.sockets.to(socket.data.id).emit('joined_channel');
  }

  @SubscribeMessage('leave_channel')
  async handleLeaveChannel(
    @MessageBody() data: leavingChannel,
    @ConnectedSocket() socket: Socket,
  ){
    const user = await this.chatService.getUserFromSocket(socket);

    if (!user) {
      return ;
    } else if (user.id === data.userId) {
      const channelName = await this.channelService.leavingChannel(data.channelId, user.id);

      // /!\ emit to room channel /!\ \\
      if (channelName != null) {
        this.server.sockets.to(socket.data.id).emit('exited_channel_list');
        this.server.sockets.to(channelName).emit('exited_channel_members', data.channelId);
        socket.leave(channelName);
      }
    }
  }

  @SubscribeMessage('ban_member')
  async handleBanMember(
    @MessageBody() data: banMember,
    @ConnectedSocket() socket: Socket,
  ){
    const user = await this.chatService.getUserFromSocket(socket);

    if (!user) {
      return ;
    }

    if (await this.channelService.isAdmin(socket.data.id, data.channelId))
    {
      const channelName = await this.channelService.banUser(data.channelId, user.id, data.userToBanId);
      if (channelName != null) {
        console.log("user banned, need to emit to front");
        this.server.sockets.to(channelName).emit('banned_user', data.userToBanId, data.channelId);
        this.server.sockets.to(channelName).emit('hide_window', data.userToBanId);
      }
    }
  }

  @SubscribeMessage('make_admin')
  async handleMakeAdmin(
    @MessageBody() data: makingAdmin,
    @ConnectedSocket() socket: Socket,
  ) {
    const user = await this.chatService.getUserFromSocket(socket);

    if (!user) {
      return ;
    } else if (user.id === data.userId) {
      const channelName = await this.channelService.makeAdmin(data.channelId, user.id, data.newAdminId);

      // /!\ emit to room channel /!\ \\
      if (channelName != null) {
        this.server.sockets.to(channelName).emit('new_admin', data.channelId);
      }
    }
  }
}
