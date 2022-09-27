import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect,} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { GameRoom, Player } from "./dto/game.dto";

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:8080',
    methods: ["GET", "POST"],
    credentials: true
  },
})  
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    private static queues: Map<string, string> = new Map(); //socketId, mode
    private static clients: Map<string, Player> = new Map(); //socketId, Playerinfos
    private static rooms: Map<string, GameRoom> = new Map(); //roomName, GameRoom
    private static participants: Map<string, string> = new Map(); //socketId, roomName

    handleConnection(socket: Socket): void {
        const socketId = socket.id;
        console.log("bonjour ", socketId);
        GameGateway.participants.set(socketId, '');
        if (!GameGateway.clients.has(socketId)) {
            GameGateway.clients.set(socketId, new Player(false));
        }
    }

    handleDisconnect(socket: Socket): void {
        const socketId = socket.id;
        const roomId = GameGateway.participants.get(socketId);
        const room = GameGateway.rooms.get(roomId);
        console.log("aurevoir ", socketId);
        GameGateway.participants.delete(socketId);
        GameGateway.clients.delete(socketId);
        GameGateway.queues.delete(socketId);
    }

    @SubscribeMessage('login')
    async loginAttempt(socket: Socket, data: string) {
        const socketId = socket.id;
        console.log(socketId, " loged");
        if (!GameGateway.clients.has(socketId)) {
            GameGateway.clients.set(socketId, new Player(false));
        }
        if (GameGateway.clients.get(socketId).loged === false) {
            GameGateway.clients.get(socketId).loged = true;
        }
        this.server.sockets.emit('searching');
    }

    @SubscribeMessage('queue_register')
    async queueRegister(socket: Socket, mode: string) {
        const socketId = socket.id;
        console.log(socketId, " i ssearching a game");
        if (!GameGateway.queues.has(socketId)) {
            GameGateway.queues.set(socketId, mode);
        }
        this.server.sockets.emit('searching');
        for (let user of GameGateway.queues.keys()) {
            let m = GameGateway.queues.get(user)
            if (user != socketId && mode == m) {
                const room_name = socketId + " vs " + user;
                var game = new GameRoom();
                game.room_name = room_name;
                game.server = this.server;
                game.mode = m;
                game.player1 = socketId;
                game.player2 = user;

                GameGateway.participants.set(user, room_name);
                GameGateway.participants.set(socketId, room_name);
                GameGateway.rooms.set(room_name, game);

                GameGateway.queues.delete(socketId);
                GameGateway.queues.delete(user);
                game.start();
                break;
            }
        }
    }
    @SubscribeMessage('update_pos')
    async updatePaddle(socket: Socket, data: any) {
        const socketId = socket.id;
        console.log(socketId);
        console.log(data[0]);
        console.log(data[1]);
        console.log(data);
        GameGateway.rooms.get(data[0]).update_gamestate(socketId, data[1]);
    }
}