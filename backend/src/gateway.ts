import { OnGatewayConnection, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChatService } from "./chat/chat.service";

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:8080',
    methods: ["GET", "POST"],
    credentials: true,
  },
})
export class AppGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(
    chatService: ChatService,
  ) {}

  async handleConnection(socket: Socket) {
    console.log("socket io id in app = ", socket.id);
  }
}