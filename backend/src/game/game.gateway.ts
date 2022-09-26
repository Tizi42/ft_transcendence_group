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
        console.log(`New connecting... socket id:`, socketId);
        GameGateway.participants.set(socketId, '');
        GameGateway.clients.set(socketId, new Player(false));
    }

    handleDisconnect(socket: Socket): void {
        const socketId = socket.id;
        console.log(`Disconnection... socket id:`, socketId);
        const roomId = GameGateway.participants.get(socketId);
        const room = GameGateway.rooms.get(roomId);

        GameGateway.queues.delete(socketId);
    }

    @SubscribeMessage('login')
    async loginAttempt(socket: Socket, data: string) {
        // login the client no matter what for the moment (todo: use auth)
        const socketId = socket.id;
        if (GameGateway.clients.get(socketId).loged === false) {
            GameGateway.clients.get(socketId).loged = true;
            this.server.sockets.emit('loged', socketId);
        }
    }

    @SubscribeMessage('queue_register')
    async queueRegister(socket: Socket, mode: string) {
        const socketId = socket.id;
        if (!GameGateway.queues.has(socketId)) {
            GameGateway.queues.set(socketId, mode);
        }
        this.server.sockets.emit('searching');
        for (let user of GameGateway.queues.keys()) {
            let m = GameGateway.queues.get(user)
            if (user != socketId && mode == m) {
                const room_name = socketId + " vs " + user;
                var game = new GameRoom();
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
    @SubscribeMessage('update_paddle')
    async updatePaddle(socket: Socket, pos: string) {
        const socketId = socket.id;
        const roomId = GameGateway.participants.get(socketId);
        GameGateway.rooms.get(roomId).update_gamestate(socketId, pos);
    }
    // static createGameRoom(roomDto: RoomDto): void {
    //     const roomId = roomDto.roomId;
    //     if (this.rooms.has(roomId)) {
    //         throw new ConflictException({code: 'room.conflict', message: `Room with '${roomId}' already exists`})
    //     }
    //     this.rooms.set(roomId, new RoomData(roomDto.creatorUsername));
    // }
}