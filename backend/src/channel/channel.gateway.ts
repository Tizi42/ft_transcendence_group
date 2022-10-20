import { ConnectedSocket, MessageBody, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChannelService } from 'src/channel/channel.service';
import { ChatService } from 'src/chat/chat.service';
import { AppGateway } from 'src/gateway';
import { UsersService } from 'src/users/users.service';
import { BattlesService } from '../battles/battles.service';
import { banMember, leavingChannel, makingAdmin, muteMember } from './utils/types';
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
  
  @SubscribeMessage('get_all_channels')
  async handleAllChannels(
    @ConnectedSocket() socket: Socket,
  ) {
    const allChannels = await this.channelService.findAll();
    // console.log("member len :", findMember.length);
    this.server.sockets.to(socket.data.id).emit('receive_all_channels', allChannels);
    return allChannels;
  }

  @SubscribeMessage('join_channel')
  async handleJoinChannel(
    @MessageBody() data: any,
    @ConnectedSocket() socket: Socket,
  ){
    console.log("data this : ", data);
    if (data.channel.type === "private") {
  }
    const authorized = await this.channelService.joinChannel(socket.data.id, data.channel, data.password);
    this.server.sockets.to(socket.data.id).emit('joined_channel', authorized);
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
        this.server.sockets.to(socket.data.id).emit('exited_channel_list');
        this.server.sockets.to(channelName).emit('channel_updated', data.channelId);
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
        // this.server.sockets.to(channelName).emit('muted_user', data.channelId, data.userToMuteId, channelName);
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
      this.server.sockets.to(socket.data.id).emit('password_error');
      return ;
    }

    if (data.channel.owner === user.id) {
      if (await this.channelService.updateChannelPrivacy(data) === null) {
        this.server.sockets.to(socket.data.id).emit('password_error');
        return ;
      }
      this.server.sockets.to(socket.data.id).emit('channel_updated', data.channel.id);
    }
  }

  @SubscribeMessage('update_channel_password')
  async handleUpdatePassword(
    @MessageBody() data: UpdatePasswordDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const user = await this.chatService.getUserFromSocket(socket);
    if (!user) {
      this.server.sockets.to(socket.data.id).emit('password_error');
      return ;
    }

    if (data.channel.owner === user.id) {
      if (await this.channelService.updateChannelPassword(data) === null) {
        this.server.sockets.to(socket.data.id).emit('password_error');
        return ;
      }
      this.server.sockets.to(socket.data.id).emit('channel_updated', data.channel.id);
    }
  }

  @SubscribeMessage('send_join_request')
  async handleJoinRequest(
    @MessageBody() channel: any,
    @ConnectedSocket() socket: Socket,
  ) {
    console.log("request iciiii");
    const auth = await this.channelService.joinRequest(socket.data.id, channel.id)
    console.log("pending ?", channel.pending);
    this.server.sockets.to(channel.owner).emit('receive_pending_request', auth, channel.id);
  }

  @SubscribeMessage('accept_join_request')
  async handleAcceptingRequest(
    @MessageBody() request: any,
    @ConnectedSocket() socket: Socket,
  ) {
    if (socket.data.id !== request.channel.owner)
      return console.log("unauthorized");
    await this.channelService.joinChannel(request.user.id, request.channel.id);
    this.server.sockets.to(request.user.id).emit('received_accepted_request', request.channel.id);
  }

  @SubscribeMessage('refuse_join_request')
  async handleRefusingRequest(
    @MessageBody() request: any,
    @ConnectedSocket() socket: Socket,
  ) {
    if (socket.data.id !== request.channel.owner)
      return console.log("unauthorized");
    await this.channelService.refuseJoining(request.user.id, request.channel.id);
    this.server.sockets.to(request.user.id).emit('received_refused_request');
  }
}
