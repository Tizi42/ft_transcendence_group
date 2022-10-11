import { Socket, Server } from 'socket.io';

export class GameRoom {
    room_name: string;
    server: Server;
    lag: number = 30;

    
    player1: string;
    player2: string;
    score_player1: number = 0;
    score_player2: number = 0;
    mode: string;
    tick: number;
    width: number = 1043;
    height: number = 591;
    paddle_width: number = 10;
    paddle_height: number = 80;
    paddle_left_pos_x: number = this.width * 0.05;
    paddle_left_pos_y: number = this.height * 0.5;
    paddle_right_pos_x: number = this.width * 0.95;
    paddle_right_pos_y: number = this.height * 0.5;

    ball_pos_x: number = 521.5;
    ball_pos_y: number = 295.5;
    ball_dir_x: number = -1.0;
    ball_dir_y: number = 0.0;
    ball_size: number = 25.6;
    ball_speed: number = 100;
    
    playerL: number;
    playerR: number;
    ready: number;
    paddle_left_velocity: number = this.height * 0.5;
    paddle_right_velocity: number = this.height * 0.5;

    constructor(left: number, right: number, name:string) {
        this.tick = Date.now();
        this.playerL = left;
        this.playerR = right;
        this.ready = 0;
        this.room_name = name;
    }
    start() {
        this.server.sockets.to(this.player1).emit('game_found', {
            'to': this.player1,
            'player': 1,
            'ball_speed': this.ball_speed,
            'ball_dir_x': this.ball_dir_x,
            'ball_dir_y': this.ball_dir_y,
            'room_name': this.room_name,
        });
        this.server.sockets.to(this.player2).emit('game_found', {
            'to': this.player2,
            'player': 2,
            'ball_speed': this.ball_speed,
            'ball_dir_x': this.ball_dir_x,
            'ball_dir_y': this.ball_dir_y,
            'room_name': this.room_name,
        });
    }

    check_collision() {
        if (this.ball_pos_y < (this.ball_size / 2)) {
            this.ball_dir_y = Math.abs(this.ball_dir_y);
        }
        else if (this.ball_pos_y > this.height - (this.ball_size / 2)) {
            this.ball_dir_y = -Math.abs(this.ball_dir_y);
        }
        else if (this.ball_pos_x < this.paddle_left_pos_x + (this.paddle_width) &&
            this.ball_pos_x > (this.paddle_left_pos_x - (this.paddle_width)) &&
            this.ball_pos_y < this.paddle_left_pos_y + (this.paddle_height / 2) &&
            this.ball_pos_y > (this.paddle_left_pos_y -  (this.paddle_height / 2))) {
                var t = ((this.ball_pos_y - (this.paddle_left_pos_y - (this.paddle_height / 2))) / this.paddle_height) - 0.5;
                this.ball_dir_x = Math.abs(this.ball_dir_x);
                this.ball_dir_y = t;
        } 
        else if (this.ball_pos_x > this.paddle_right_pos_x - (this.paddle_width / 2) &&
            this.ball_pos_x < (this.paddle_right_pos_x + (this.paddle_width / 2)) &&
            this.ball_pos_y < this.paddle_right_pos_y + (this.paddle_height / 2) &&
            this.ball_pos_y > (this.paddle_right_pos_y -  (this.paddle_height / 2))) {
                var t = ((this.ball_pos_y - (this.paddle_right_pos_y - (this.paddle_height / 2))) / this.paddle_height) - 0.5;
                this.ball_dir_x = -Math.abs(this.ball_dir_x);
                this.ball_dir_y = t;
        }
        else if (this.ball_pos_x < this.width * 0.02) {
            this.score_player2 += 1;
        }
        else if (this.ball_pos_x > this.width * 0.98) {
            this.score_player1 += 1;
        }
    }

    update_clients() {
        this.server.sockets.to(this.player2).emit('game_state', {
            'to': this.player2,
            'pos': this.paddle_left_pos_y,
            'ball_pos_x': this.ball_pos_x,
            'ball_pos_y': this.ball_pos_y,
            'ball_dir_x': this.ball_dir_x,
            'ball_dir_y': this.ball_dir_y,
            'ball_speed': this.ball_speed,
        });
        this.server.sockets.to(this.player1).emit('game_state', {
            'to': this.player1,
            'pos': this.paddle_right_pos_y,
            'ball_pos_x': this.ball_pos_x,
            'ball_pos_y': this.ball_pos_y,
            'ball_dir_x': this.ball_dir_x,
            'ball_dir_y': this.ball_dir_y,
            'ball_speed': this.ball_speed,
        });
    }

    update_gamestate(socketId: string, pos: string) {
        if (this.player1 == socketId) {
            this.paddle_left_pos_y = +pos;
        } else {
            this.paddle_right_pos_y = +pos;
        }

        const now = Date.now();
        var diff = now - this.tick;

        if (diff > this.lag) {
            while (diff > this.lag) {
                var speed = this.ball_speed * (this.lag * 0.001);
                this.ball_pos_x += this.ball_dir_x * speed;
                this.ball_pos_y += this.ball_dir_y * speed;
                diff -= this.lag; 
                this.check_collision();
            }
        } else {
            var speed = this.ball_speed * ((now - this.tick) * 0.001);
            this.ball_pos_x += this.ball_dir_x * speed;
            this.ball_pos_y += this.ball_dir_y * speed;
            this.check_collision();
        }
        this.tick = now;
        this.update_clients();
    }
 
}