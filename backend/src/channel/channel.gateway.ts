import { ConnectedSocket, MessageBody, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChannelService } from 'src/channel/channel.service';
import { ChatService } from 'src/chat/chat.service';
import { AppGateway } from 'src/gateway';
import { UsersService } from 'src/users/users.service';

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
  ) {
    console.log("hola ?");
    const newChannel = await this.channelService.createChannel(data);
    this.server.sockets.emit('receive_channel_created', newChannel);
    return newChannel;
  }

  @SubscribeMessage('get_all_my_channels')
  async handleAllMyChannels(
    @ConnectedSocket() socket: Socket,
  ) {
    const channel = await this.channelService.getAllMyChannels(socket.data.id);
    console.log("all my channel = ", channel);
    console.log("my id = ", socket.data.id);
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
    @MessageBody() channel: any,
    @ConnectedSocket() socket: Socket,
  ){
      await this.channelService.leavingChannel(socket.data.id, channel);
      this.server.sockets.to(socket.data.id).emit('channel_leaved', channel);
  }

  @SubscribeMessage('ban_member')
  async removeMember(
    @MessageBody() data: any,
    @ConnectedSocket() socket: Socket,
  ){
    if (await this.usersService.findOneById(data.user.id) === null)
      return console.log("user don't exist");

    if (await this.channelService.isAdmin(socket.data.id, data.channel.id))
    {  
      await this.channelService.leavingChannel(data.user, data.channel);
      await this.channelService.banUser(data.user, data.channel);
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
