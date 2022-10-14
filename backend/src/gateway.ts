import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChatService } from "./chat/chat.service";
import { UsersService } from "./users/users.service";

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
  ) {}

  async handleConnection(socket: Socket) {
    const users = [];

    socket.data = await this.chatService.getUserFromSocket(socket);
    console.log("socket user id: ", socket.data);
    if (socket.data) {
      socket.join(socket.data.id);
      this.usersService.updateIsOnline(socket.data.id, "online");
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

  handleDisconnect(socket: Socket) {
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
        this.usersService.updateIsOnline(socket.data.id, "offline");
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
}