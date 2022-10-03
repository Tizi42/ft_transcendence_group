import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
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
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    readonly chatService: ChatService,
    readonly usersService: UsersService,
  ) {}

  afterInit(server: Server) {
    console.log("initialized :", server);
  }

  async handleConnection(socket: Socket) {
    const users = [];

    socket.data = await this.chatService.getUserFromSocket(socket);
    if (socket.data) {
      this.usersService.updateIsOnline(socket.data.id, "online");
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

  handleDisconnect(client: any) {
    const users = [];
    let   stillOnline: boolean = false;
    if (client.data) {
      console.log("disconnected :", client.data.username);
      for (let [id, socket] of this.server.of("/").sockets) {
        if (socket.data) {
          if (socket.data.username === client.data.username) {
            stillOnline = true;
          }
        }
      }
      if (!stillOnline) {
        this.usersService.updateIsOnline(client.data.id, "offline");
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