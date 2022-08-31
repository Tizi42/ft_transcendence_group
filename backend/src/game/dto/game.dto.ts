import {IsNotEmpty} from 'class-validator';

export class GameRoom {
    player1: string;
    player2: string;
    mode: string;
}

export class Player {
    loged: boolean;

    constructor(logState: boolean) {
        this.loged = logState;
    }
}