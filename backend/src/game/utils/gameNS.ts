import { GameRoom } from "./game";

export class GameRoomNS {
    constructor(value: GameRoom, mode: string = "normal") {
        this.room_name = value.room_name;
        if (value.mode === undefined)
            this.mode = mode;
        this.playerL = value.playerL;
        this.playerR = value.playerR;
    }
    room_name: string;
    mode: string;
    playerL: number;
    playerR: number;
}
