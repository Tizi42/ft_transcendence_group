import { Socket, Server } from 'socket.io';

export class GameRoom {

  //current game info
  current_game_id: number;
  score_left = 0;
  score_right = 0;
  winner: number;
  
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
  readonly paddle_height_half = 40;
  readonly paddle_left_x = this.width * 0.02; //paddle_width is 10
  readonly paddle_right_x  = this.width * 0.98;
  readonly max_angle = Math.PI / 4;

  // changeable
  paddle_velocity = 10;
  ball_velocity_init = 7.5; // 7.5 pixels per 25ms, 300 pixels per 1000ms
  ball_velocity = this.ball_velocity_init;
  
  // update game
  update_frequencey = 25; // 1 time per 25ms, 40th of a second
  interval: ReturnType<typeof setInterval>;
  ball_velocity_x: number;
  ball_velocity_y: number;
  paddle_left_y = this.height * 0.5;
  paddle_right_y = this.height * 0.5;
  ball_x: number;
  ball_y: number;
  
  // for magic mode
  spell_L = 0;
  spell_R = 0;


  constructor(l: number, l_sid: string, r: number, r_sid: string, mode:string, server: Server) {
    // this.tick = Date.now();
    this.playerL = l;
    this.playerR = r;
    this.sidL =  l_sid;
    this.sidR = r_sid;
    this.ready = 0;
    this.mode = mode;
    this.room_name = l + " vs " + r;
    this.server = server;
    if (this.mode === "speed") {
      this.ball_velocity_init = 15;
      this.paddle_velocity = 12;
    }
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

  on_launch(direction: string)
  {
    console.log("on ball launch");
    // intial ball's launch position and velocity
    this.ball_velocity = this.ball_velocity_init;
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
      paddle_left_posY: this.paddle_left_y,
      paddle_right_posY: this.paddle_right_y,
      ball_x: this.ball_x,
      ball_y: this.ball_y,
    });
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
      ball_left < this.paddle_left_x + 10 &&
      ball_left > this.paddle_left_x - 5 &&
      ball_top < this.paddle_left_y + this.paddle_height_half &&
      ball_bottom > this.paddle_left_y - this.paddle_height_half
    ){
      this.ball_velocity *= 1.05;
      let bounce_angle = this.max_angle * ((this.ball_y - this.paddle_left_y) / 40);
      this.ball_velocity_x = this.ball_velocity * Math.cos(bounce_angle);
      this.ball_velocity_y = this.ball_velocity * Math.sin(bounce_angle);
    }
    else if (
      ball_right < this.paddle_right_x + 5 &&
      ball_right > this.paddle_right_x - 10  &&
      ball_top < this.paddle_right_y + this.paddle_height_half &&
      ball_bottom > this.paddle_right_y - this.paddle_height_half
    ){
      this.ball_velocity *= 1.05;
      let bounce_angle = this.max_angle * ((this.ball_y - this.paddle_right_y) / 40);
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

  check_game_end() {
    if (
      (this.score_left >= 11 || this.score_right >= 11) &&
      Math.abs(this.score_left - this.score_right) >= 2
    ){
      this.winner = this.score_left > this.score_right ? this.playerL : this.playerR;
      let winner_side = this.score_left > this.score_right ? "left" : "right";
      console.log(this.score_left, " : ", this.score_right);
      this.server.to(this.room_name).emit("end", {
        winner: winner_side,
      });
      this.reset_score();
      return true;
    }
    return false;
  }

  next_ball_pos() {
    this.ball_x += this.ball_velocity_x;
    this.ball_y += this.ball_velocity_y;
  }

  reset_score() {
    this.score_left = 0;
    this.score_right = 0;
  }
}