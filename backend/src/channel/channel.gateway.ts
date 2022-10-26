import { ConnectedSocket, MessageBody, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChannelService } from 'src/channel/channel.service';
import { ChatService } from 'src/chat/chat.service';
import { AppGateway } from 'src/gateway';
import { UsersService } from 'src/users/users.service';
import { BattlesService } from '../battles/battles.service';
import { smallDataChannel } from './utils/smallDataChannel.dto';
import { banMember, createChannel, joinReq, leavingChannel, makingAdmin, muteMember } from './utils/types';
import { UpdatePasswordDto } from './utils/UpdatePassword.dto';
import { UpdatePrivacyDto } from './utils/updatePrivacy.dto';

export class ChannelGateway extends AppGateway {

  constructor(
    readonly chatService: ChatService,
    readonly usersService: UsersService,
    readonly channelService: ChannelService,
    readonly battlesService: BattlesService,
  ) {
    super(chatService, usersService, channelService, battlesService);
  }

  async handleConnection() {}

  async handleDisconnect() {}

  @SubscribeMessage('create_channel')
  async handleCreateChannel(
    @MessageBody() data: smallDataChannel,
    @ConnectedSocket() socket: Socket,
  ) {
    const user = await this.chatService.getUserFromSocket(socket);

    if (!user) {
      return ;
    }
    const newChannel = await this.channelService.createChannel(data);
  
    if (newChannel != null && newChannel != "password_error" && newChannel != "channel_name_error") {
      socket.join(newChannel.name);
      this.server.sockets.to(socket.data.id.toString()).emit('receive_channel_created');
      this.server.sockets.to(newChannel.name).emit('channel_updated', newChannel.id);
      this.server.sockets.emit('new_channel_created');
    } else if (newChannel === "password_error") {
      this.server.sockets.to(socket.data.id.toString()).emit('password_error');
    } else if (newChannel === "channel_name_error") {
      this.server.sockets.to(socket.data.id.toString()).emit('channel_name_error');
    }
    return newChannel;
  }

  @SubscribeMessage('get_all_my_channels')
  async handleAllMyChannels(
    @ConnectedSocket() socket: Socket,
  ) {
    const user = await this.chatService.getUserFromSocket(socket);

    if (!user) {
      return ;
    }
    const channel = await this.channelService.getAllMyChannels(socket.data.id);
    
    this.server.sockets.to(socket.data.id.toString()).emit('receive_all_my_channels', channel);
    return channel;
  }
  
  @SubscribeMessage('get_all_channels')
  async handleAllChannels(
    @ConnectedSocket() socket: Socket,
  ) {
    const user = await this.chatService.getUserFromSocket(socket);

    if (!user) {
      return ;
    }
    
    const allChannelsButPrivate = await this.channelService.findAllChannelsAndMembersButPrivate();
    this.server.sockets.to(socket.data.id.toString()).emit('receive_all_channels', allChannelsButPrivate);
    this.server.sockets.to(socket.data.id.toString()).emit('channel_updated', -1);
    return allChannelsButPrivate;
  }

  @SubscribeMessage('join_channel')
  async handleJoinChannel(
    @MessageBody() data: createChannel,
    @ConnectedSocket() socket: Socket,
  ){
    const user = await this.chatService.getUserFromSocket(socket);

    if (!user) {
      return ;
    }
    const channelName = await this.channelService.joinChannel(user, data.channelId, data.password);
    
    if (channelName === "password_error") {
      this.server.sockets.to(socket.data.id.toString()).emit('password_error');
    } else if (channelName === "ban_error") {
      this.server.sockets.to(socket.data.id.toString()).emit('ban_error');
    } else if (channelName != null) {
      socket.join(channelName);
      this.server.sockets.to(socket.data.id.toString()).emit('joined_channel', data.channelId);
      this.server.sockets.to(channelName).emit('channel_updated', data.channelId);
    }
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

      if (channelName != null) {
        this.server.sockets.to(socket.data.id.toString()).emit('exited_channel_list');
        this.server.sockets.emit('channel_updated', data.channelId);
        socket.leave(channelName);
        const allChannelsButPrivate = await this.channelService.findAllChannelsAndMembersButPrivate();
        this.server.sockets.to(socket.data.id.toString()).emit('receive_all_channels', allChannelsButPrivate);
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

      if (channelName != null) {
        this.server.sockets.to(channelName).emit('channel_updated', data.channelId);
      }
    }
  }

  @SubscribeMessage('mute_user')
  async handleMuteUser(
    @MessageBody() data: muteMember,
    @ConnectedSocket() socket: Socket,
  ) {
    const user = await this.chatService.getUserFromSocket(socket);

    if (!user) {
      return ;
    }

    if (await this.channelService.isAdmin(socket.data.id, data.channelId))
    {
      const channelName = await this.channelService.muteUser(data.channelId, data.userToMuteId);
      if (channelName != null) {
        this.server.sockets.to(channelName).emit('channel_updated', data.channelId);
        setTimeout(async () => {
          await this.channelService.unMuteUser(data.channelId, data.userToMuteId);
          this.server.sockets.to(channelName).emit('channel_updated', data.channelId);
        }, 300000);
      }
    }
  }

  @SubscribeMessage('update_channel_privacy')
  async handleUpdatePrivacy(
    @MessageBody() data: UpdatePrivacyDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const user = await this.chatService.getUserFromSocket(socket);
    if (!user) {
      return ;
    }

    if (data.channel.owner === user.id) {
      const channelUpdated = await this.channelService.updateChannelPrivacy(data);
      if (channelUpdated === "password_error") {
        this.server.sockets.to(socket.data.id.toString()).emit('password_error');
      } else if (channelUpdated != null) {
        this.server.sockets.to(socket.data.id.toString()).emit('channel_updated', data.channel.id);
        const allChannelsButPrivate = await this.channelService.findAllChannelsAndMembersButPrivate();
        this.server.sockets.emit('receive_all_channels', allChannelsButPrivate);
      }
    }
  }

  @SubscribeMessage('update_channel_password')
  async handleUpdatePassword(
    @MessageBody() data: UpdatePasswordDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const user = await this.chatService.getUserFromSocket(socket);
    if (!user) {
      return ;
    }

    if (data.channel.owner === user.id) {
      const channelUpdated = await this.channelService.updateChannelPassword(data);
      if (channelUpdated === "password_error") {
        this.server.sockets.to(socket.data.id.toString()).emit('password_error');
      } else if (channelUpdated != null) {
        this.server.sockets.to(socket.data.id.toString()).emit('channel_updated', data.channel.id);
      }
    }
  }

  @SubscribeMessage('update_join_request')
  async handleJoinRequest(
    @MessageBody() data: joinReq,
  ) {
    this.server.sockets.to(data.to.toString()).emit('update_channel_invite', data);
  }

  @SubscribeMessage('accept_join_request')
  async handleAcceptingRequest(
    @MessageBody() data: joinReq,
    @ConnectedSocket() socket: Socket,
  ) {
    const user = await this.chatService.getUserFromSocket(socket);
    const channel = await this.channelService.findChannelAndMembers(data.from);
    if (!user || !channel) {
      return ;
    }
    socket.join(channel[0].name);
    this.server.sockets.to(socket.data.id.toString()).emit('joined_channel', data.from);
    this.server.sockets.to(channel[0].name).emit('channel_updated', data.from);
  }

  @SubscribeMessage("logout_all")
  async handleLogout() {}
}
