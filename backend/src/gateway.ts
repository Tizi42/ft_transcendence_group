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
      socket.join(socket.data.id);
      await this.channelService.joinChannelsRooms(socket);
      await this.usersService.updateUserStatus(socket.data.id, "online");
      for (let i = 0; i < socket.data.friendWith.length; i++) {
        let friend: any = socket.data.friendWith[i];
        this.server.sockets.to(friend).emit('friend_login_logout');
      }
      // console log the room for this user //
      const rooms = this.server.of("/").adapter.rooms;
      console.log("room users id :", socket.data.id, " = ", rooms.get(socket.data.id));
      console.log("length room = ", rooms.get(socket.data.id).size);
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
      socket.leave(socket.data.id);
      const rooms = this.server.of("/").adapter.rooms;
      // console log disconnected and leave room for this user //
      console.log("disconnected :", socket.data.username);
      console.log("room users id :", socket.data.id, " = ", rooms.get(socket.data.id));
      if (rooms.get(socket.data.id)) {
        console.log("length room = ", rooms.get(socket.data.id).size);
      }
      // //////////////////////////////////////////////////// //
      if (!rooms.get(socket.data.id)) {
        await this.usersService.updateUserStatus(socket.data.id, "offline");
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
    this.server.sockets.to(socket.data.id).emit('force_logout');
    await this.usersService.updateUserStatus(user.id, "offline");
    for (let i = 0; i < user.friendWith.length; i++) {
      let friend: any = user.friendWith[i];
      this.server.sockets.to(friend).emit('friend_login_logout');
    }
  }
}