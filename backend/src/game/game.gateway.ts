import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect,} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { GameRoom, Player } from "./dto/game.dto";

@WebSocketGateway({
    cors: {
        origin: '*',
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
    async listenForMessages(socket: Socket, mode: string) {
        console.log(mode);
        const socketId = socket.id;
        if (!GameGateway.queues.has(socketId)) {
            GameGateway.queues.set(socketId, mode);
        }
        this.server.sockets.emit('searching');
        for (let user of GameGateway.queues.keys()) {
            let m = GameGateway.queues.get(user)
            if (user != socketId && mode == m) {
                var game = new GameRoom();
                game.mode = m;
                game.player1 = user;
                game.player2 = socketId;

                GameGateway.rooms.set((socketId + " vs " + user), game);
                this.server.sockets.to(user).emit('game_found', user);
                this.server.sockets.emit('game_found', socketId);

                GameGateway.queues.delete(socketId);
                GameGateway.queues.delete(user);
                break;
            }
        }
    }

    // static createGameRoom(roomDto: RoomDto): void {
    //     const roomId = roomDto.roomId;
    //     if (this.rooms.has(roomId)) {
    //         throw new ConflictException({code: 'room.conflict', message: `Room with '${roomId}' already exists`})
    //     }
    //     this.rooms.set(roomId, new RoomData(roomDto.creatorUsername));
    // }
}