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
  async createChannel(
    @MessageBody() data: any
  ) {
    console.log("my channel = ", data);
    const channel = await this.channelService.createChannel(data);
  
    this.server.sockets.emit('channel_created');
    return channel;
  }

  @SubscribeMessage('get_allChannels')
  async getMyChannel(
    @ConnectedSocket() socket: Socket,
  ) {
    const channel = await this.channelService.getAllChannel(socket.data.id);
    console.log("all my channel = ", channel);
    console.log("my id = ", socket.data.id);
    this.server.sockets.to(socket.data.id).emit('get_myChannels', channel);
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
  async leaveChannel(
    @MessageBody() data: any,
    @ConnectedSocket() socket: Socket,
  ){
    if (await this.usersService.findOneById(data.user.id) === null)
      return console.log("user don't exist");

    if (socket.data.id === data.user.id)
      await this.channelService.leavingChannel(data.user, data.channel);
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
}
