import { GameRoom } from "./gameRoom";

export class GameRoomNS {
    constructor(value: GameRoom, roomName: string) {
        this.room_name = roomName;
        this.playerL = value.playerL;
        this.playerR = value.playerR;
    }
    room_name: string;
    mode: string;
    playerL: number;
    playerR: number;
}
