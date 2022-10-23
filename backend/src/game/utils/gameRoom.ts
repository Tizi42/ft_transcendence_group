import { Server } from 'socket.io';
import { BattlesService } from '../../battles/battles.service';
import GameStatus from "./type";

export class GameRoom {

  //current game info
  current_game_id: number;
  score_left = 0;
  score_right = 0;
  winner: number;
  game_status: GameStatus;
  
  // basic room info
  room_name: string;
  playerL: number;
  playerR: number;
  sidL: string;
  sidR: string;
  ready: number;
  server: Server;
  mode: string;
  
  // unchangeable
  readonly width = 1043;
  readonly height = 591;
  readonly leftBounds = -30;
  readonly rightBounds = this.width + 30;
  readonly ball_radius = 12.8;
  readonly paddle_width_half = 5;
  readonly max_angle = Math.PI / 4;
  readonly hit_range = {
    normal: 5,
    magic: 5,
    speed: 8,
  };
  readonly ball_velocity_init = {
    normal: 7.5, // 7.5 pixels per 25ms, 300 pixels per 1000ms
    magic: 7.5,
    speed: 15,
  };
  readonly paddle_velocity_init = {
    normal: 10,
    magic: 10,
    speed: 20,
  };
  readonly acceleration = {
    normal: 1.15,
    magic: 1.15,
    speed: 1.05,
  };
  
  // update game
  update_frequencey = 25; // 1 time per 25ms, 40th of a second
  interval: ReturnType<typeof setInterval>;
  ball_velocity_x: number;
  ball_velocity_y: number;
  ball_x: number;
  ball_y: number;
  ball_velocity: number;
  paddle = {
    left: {
      x: this.width * 0.02,
      y: this.height * 0.5,
      height_half: 40,
      velocity: this.paddle_velocity_init,
    },
    right: {
      x: this.width * 0.98,
      y: this.height * 0.5,
      height_half: 40,
      velocity: this.paddle_velocity_init,
    }
  }
  
  // for magic mode
  spell_L = 0;
  spell_R = 0;


  constructor(
    l: number,
    l_sid: string, 
    r: number,
    r_sid: string,
    mode:string,
    server: Server,
    readonly battlesService: BattlesService,
  ){
    this.playerL = l;
    this.playerR = r;
    this.sidL =  l_sid;
    this.sidR = r_sid;
    this.ready = 0;
    this.mode = mode;
    this.room_name = l + " vs " + r;
    this.server = server;
    this.ball_velocity = this.ball_velocity_init[mode];
    this.game_status = "not_ready";
  }

  async start_game() {
    this.server.to(this.room_name).emit("game_start");
    if (this.mode == "speed") {
      setTimeout(this.speed_game_end.bind(this), 180000);
    }
    this.current_game_id = await this.battlesService.addOne({
      opponent1: this.playerL,
      opponent2: this.playerR,
      mode: this.mode,
    });
    this.getRandomInt(1) === 1 ? this.on_launch("toRight") : this.on_launch("toLeft");
    this.game_status = "running";
  }

  on_launch(direction: string)
  {
    console.log("on ball launch");
    // intial ball's launch position and velocity
    this.ball_velocity = this.ball_velocity_init[this.mode];
    const randomHeight = this.getRandomNumberBetween(80, 511); // height 591 - 80 
    const randVelocity = this.getRandomVelocity(direction);
    this.ball_x = this.width / 2;
    this.ball_y = randomHeight;
    this.ball_velocity_x = randVelocity[0];
    this.ball_velocity_y = randVelocity[1];
    // start update
    this.interval = setInterval(this.update_game.bind(this), this.update_frequencey);
  }

  update_game() {
    this.check_collision();
    this.check_score();
    this.next_ball_pos();
    this.server.to(this.room_name).emit("game_update", {
      paddle_left_posY: this.paddle.left.y,
      paddle_right_posY: this.paddle.right.y,
      ball_x: this.ball_x,
      ball_y: this.ball_y,
    });
  }

  on_paddle_move(user_id: number, paddle_move_direction: number) {
    let side: string;
    if (this.playerL === user_id) side = "left";
    else if (this.playerR === user_id) side = "right";
    else return;
    
    let dir = paddle_move_direction > 0 ? 1 : -1;
    this.paddle[side].y += this.paddle[side].velocity[this.mode] * dir;
  
    if (this.paddle[side].y < this.paddle[side].height_half)
      this.paddle[side].y = this.paddle[side].height_half;
    else if (this.paddle[side].y > this.height - this.paddle[side].height_half) 
      this.paddle[side].y = this.height - this.paddle[side].height_half;
  }

  next_ball_pos() {
    this.ball_x += this.ball_velocity_x;
    this.ball_y += this.ball_velocity_y;
  }

  check_collision() {
    let ball_top = this.ball_y - this.ball_radius;
    let ball_bottom = this.ball_y + this.ball_radius;
    let ball_left = this.ball_x - this.ball_radius;
    let ball_right = this.ball_x + this.ball_radius;

    // check if ball collides with world bound
    if (ball_top < 0 ||
        ball_bottom > this.height) {
        this.ball_velocity_y *= -1;
    }
    // check if ball collides with paddle
    else if (
      ball_left < this.paddle.left.x + this.hit_range[this.mode] &&
      ball_left > this.paddle.left.x - this.hit_range[this.mode]  &&
      ball_top < this.paddle.left.y + this.paddle.left.height_half &&
      ball_bottom > this.paddle.left.y - this.paddle.left.height_half
    ){
      this.ball_velocity *= this.acceleration[this.mode];
      let bounce_angle = this.max_angle * ((this.ball_y - this.paddle.left.y) / this.paddle.left.height_half);
      this.ball_velocity_x = this.ball_velocity * Math.cos(bounce_angle);
      this.ball_velocity_y = this.ball_velocity * Math.sin(bounce_angle);
    }
    else if (
      ball_right < this.paddle.right.x + this.hit_range[this.mode] &&
      ball_right > this.paddle.right.x - this.hit_range[this.mode] &&
      ball_top < this.paddle.right.y + this.paddle.right.height_half &&
      ball_bottom > this.paddle.right.y - this.paddle.right.height_half
    ){
      this.ball_velocity *= this.acceleration[this.mode];
      let bounce_angle = this.max_angle * ((this.ball_y - this.paddle.right.y) / this.paddle.right.height_half);
      this.ball_velocity_x = -this.ball_velocity * Math.cos(bounce_angle);
      this.ball_velocity_y = this.ball_velocity * Math.sin(bounce_angle);
    }
  }

  check_score() {
    let direction: string;
    if (this.ball_x < this.leftBounds) {
      direction = "toLeft";
      this.score_right += 1;
    }
    else if (this.ball_x > this.rightBounds) {
      direction = "toRight";
      this.score_left += 1;
    }
    else return;
    // if new score
    this.server.to(this.room_name).emit("score_update", {
      left: this.score_left,
      right: this.score_right,
    });
    clearInterval(this.interval);
    if (!this.check_game_end())
      this.on_launch(direction);
  }

  check_game_end(): boolean {
    if (this.mode === "speed")
      return false;
    if (
      (this.score_left >= 11 || this.score_right >= 11) &&
      Math.abs(this.score_left - this.score_right) >= 2
    ){
      this.winner = this.score_left > this.score_right ? this.playerL : this.playerR;
      let winner_side = this.score_left > this.score_right ? "left" : "right";
      this.server.to(this.room_name).emit("end", {
        winner: winner_side,
      });
      this.game_status = "ended";
      this.save_game();
      this.reset_game();
      return true;
    }
    return false;
  }

  speed_game_end(){
    clearInterval(this.interval);
    this.winner = this.score_left > this.score_right ? this.playerL : this.playerR;
    let winner_side = this.score_left > this.score_right ? "left" : "right";
    if (this.score_left === this.score_right) {
      this.winner = -1;
      winner_side = "none";
    }
    this.server.to(this.room_name).emit("end", {
      winner: winner_side,
    });
    this.game_status = "ended";
    this.save_game();
    this.reset_game();
  }

  save_game() {
    this.battlesService.end(
      this.current_game_id,
      this.winner,
      this.score_left,
      this.score_right
    );
  }

  reset_game() {
    this.score_left = 0;
    this.score_right = 0;
    this.winner = -1;
  }

  stop_game() {
    this.game_status = "ended";
    clearInterval(this.interval);
  }

  /*
  **    UTILS
  */
  getRandomInt(max: number = 100) : number {
    return Math.floor(Math.random() * max);
  }

  getRandomNumberBetween(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  getRandomVelocity(direction: string) {
    let angle = this.getRandomNumberBetween(-this.max_angle, this.max_angle);
    let vx = this.ball_velocity * Math.cos(angle);
    let vy = this.ball_velocity * Math.sin(angle);
    if (direction === "toLeft")
      vx = -vx;
    return ([
      vx,
      vy
    ]);
  }
}