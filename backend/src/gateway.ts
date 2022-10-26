import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChannelService } from "./channel/channel.service";
import { ChatService } from "./chat/chat.service";
import { UsersService } from "./users/users.service";
import { BattlesService } from "./battles/battles.service";

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:8080',
    methods: ["GET", "POST"],
    credentials: true,
  },
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    readonly chatService: ChatService,
    readonly usersService: UsersService,
    readonly channelService: ChannelService,
    readonly battlesService: BattlesService
  ) {}

  async handleConnection(socket: Socket) {
    const users = [];
    socket.data = await this.chatService.getUserFromSocket(socket);
    console.log("socket user id: ", socket.data);
    if (socket.data) {
      socket.join(socket.data.id.toString());
      await this.channelService.joinChannelsRooms(socket);
      await this.usersService.updateUserStatus(socket.data.id, "online");
      for (let i = 0; i < socket.data.friendWith.length; i++) {
        this.server.sockets.to(socket.data.friendWith[i].toString()).emit('friend_login_logout');
      }
      // console log the room for this user //
      // const rooms = this.server.of("/").adapter.rooms;
      // console.log("room users id :", socket.data.id, " = ", rooms.get(socket.data.id.toString()));
      // console.log("length room = ", rooms.get(socket.data.id.toString()).size);
      // ////////////////////////////////// //
    }

    // console log all socket detected, even login or not //
    for (let [id, socket] of this.server.of("/").sockets) {
      users.push({
        userID: id,
        username: socket.data?.username,
      });
    }
    console.log("users = ", users);
    // ////////////////////////////////////////////////// //
  }

  async handleDisconnect(socket: Socket) {
    const users = [];
    if (socket.data) {
      console.log("handle disconnect");
      socket.leave(socket.data.id.toString());
      const rooms = this.server.of("/").adapter.rooms;
      // console log disconnected and leave room for this user //
      // console.log("disconnected :", socket.data.username);
      // console.log("room users id :", socket.data.id, " = ", rooms.get(socket.data.id.toString()));
      // if (rooms.get(socket.data.id.toString())) {
      //   // console.log("length room = ", rooms.get(socket.data.id.toString()).size);
      // }
      // //////////////////////////////////////////////////// //
      if (!rooms.get(socket.data.id.toString())) {
        await this.usersService.updateUserStatus(socket.data.id, "offline");
        console.log("go offline, page closed!!!!!!!!!!!!!!");
        this.server.sockets.emit('friend_login_logout');
      }
    }

    // console log all socket detected, even login or not //
    for (let [id, socket] of this.server.of("/").sockets) {
      users.push({
        userID: id,
        username: socket.data?.username,
      });
    }
    console.log("users = ", users);
    // ////////////////////////////////////////////////// //
  }

  @SubscribeMessage("logout_all")
  async handleLogout(@ConnectedSocket() socket: Socket) {
    const user = await this.chatService.getUserFromSocket(socket);
    if (!user) {
      return ;
    }
    this.server.sockets.to(socket.data.id.toString()).emit('force_logout');
    await this.usersService.updateUserStatus(user.id, "offline");
    for (let i = 0; i < user.friendWith.length; i++) {
      this.server.sockets.to(user.friendWith[i].toString()).emit('friend_login_logout');
    }
  }
}