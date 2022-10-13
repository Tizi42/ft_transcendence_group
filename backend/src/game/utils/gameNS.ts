import { GameRoom } from "./game";

export class GameRoomNS {
    constructor(value: GameRoom) {
        this.room_name = value.room_name;
        this.mode = value.mode;
        this.player1 = value.player1;
        this.player2 = value.player2;
        this.playerL = value.playerL;
        this.playerR = value.playerR;
    }
    room_name: string;
    mode: string;
    playerL: number;
    playerR: number;
    player1: string;
    player2: string;
}
