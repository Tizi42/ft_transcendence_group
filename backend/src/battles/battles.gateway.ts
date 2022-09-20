import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect,} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { GameRoom, Player } from "./utils/game.dto";

@WebSocketGateway({
    cors: {
        origin: '*',
  },
})

export class BattlesGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    private static queues: Map<string, string> = new Map(); //socketId, mode
    private static clients: Map<string, Player> = new Map(); //socketId, Playerinfos
    private static rooms: Map<string, GameRoom> = new Map(); //roomName, GameRoom
    private static participants: Map<string, string> = new Map(); //socketId, roomName

    handleConnection(socket: Socket): void {
        const socketId = socket.id;
        console.log("bonjour ", socketId);
        BattlesGateway.participants.set(socketId, '');
        if (!BattlesGateway.clients.has(socketId)) {
            BattlesGateway.clients.set(socketId, new Player(false));
        }
    }

    handleDisconnect(socket: Socket): void {
        const socketId = socket.id;
        const roomId = BattlesGateway.participants.get(socketId);
        const room = BattlesGateway.rooms.get(roomId);
        console.log("aurevoir ", socketId);
        BattlesGateway.participants.delete(socketId);
        BattlesGateway.clients.delete(socketId);
        BattlesGateway.queues.delete(socketId);
    }

    @SubscribeMessage('login')
    async loginAttempt(socket: Socket, data: string) {
        const socketId = socket.id;
        console.log(socketId, " loged");
        if (!BattlesGateway.clients.has(socketId)) {
            BattlesGateway.clients.set(socketId, new Player(false));
        }
        if (BattlesGateway.clients.get(socketId).loged === false) {
            BattlesGateway.clients.get(socketId).loged = true;
        }
        this.server.sockets.emit('searching');
    }

    @SubscribeMessage('queue_register')
    async queueRegister(socket: Socket, mode: string) {
        const socketId = socket.id;
        console.log(socketId, " i ssearching a game");
        if (!BattlesGateway.queues.has(socketId)) {
            BattlesGateway.queues.set(socketId, mode);
        }
        this.server.sockets.emit('searching');
        for (let user of BattlesGateway.queues.keys()) {
            let m = BattlesGateway.queues.get(user)
            if (user != socketId && mode == m) {
                const room_name = socketId + " vs " + user;
                var game = new GameRoom();
                game.room_name = room_name;
                game.server = this.server;
                game.mode = m;
                game.player1 = socketId;
                game.player2 = user;

                BattlesGateway.participants.set(user, room_name);
                BattlesGateway.participants.set(socketId, room_name);
                BattlesGateway.rooms.set(room_name, game);

                BattlesGateway.queues.delete(socketId);
                BattlesGateway.queues.delete(user);
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
        BattlesGateway.rooms.get(data[0]).update_gamestate(socketId, data[1]);
    }
}