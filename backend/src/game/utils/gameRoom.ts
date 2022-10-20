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
  readonly paddle_left_x = this.width * 0.02; //paddle_width is 10
  readonly paddle_right_x  = this.width * 0.98;

  // changeable
  paddle_height = 80;
  paddle_velocity = 10;
  ball_velocity = 7; // 5 pixels per 25ms, 300 pixels per 1000ms
  
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
      this.ball_velocity = 15;
      this.paddle_velocity = 12;
    }
  }

  getRandomIntBetween(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  getRandomVelocity(direction: string) {
    let minVelocity = this.ball_velocity - 2.5;
    let maxVelocity = this.ball_velocity;
    let vx = this.getRandomIntBetween(minVelocity, maxVelocity);
    let vy = this.getRandomIntBetween(minVelocity, maxVelocity);
    if (direction === "toLeft")
      vx = -vx;
    if (this.getRandomIntBetween(0, 1) === 0)
      vy = -vy;
    return ([
      vx,
      vy
    ]);
  }

  on_launch(direction: string)
  {
    console.log("on ball launch");
    // intial ball's launch position and velocity
    const randomHeight = this.getRandomIntBetween(80, 511); // height 591 - 80 
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
    // check if ball collides with world bound
    if (this.ball_y < this.ball_radius ||
        this.ball_y > this.height - this.ball_radius) {
        this.ball_velocity_y *= -1;
    }
    // check if ball collides with paddle
    // else if (
    //   this.ball_x + this.ball_radius < this.paddle_left_x &&
    //   this.ball_x > (this.paddle_left_x - (this.paddle_width_half)) &&
    //   this.ball_y < this.paddle_left_y + (this.paddle_height / 2) &&
    //   this.ball_y > (this.paddle_left_y -  (this.paddle_height / 2))
    // ){

    // }
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
    else
      return;

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

  // update_gamestate(socketId: string, pos: string) {
  //     if (this.player1 == socketId) {
  //         this.paddle_left_y = +pos;
  //     } else {
  //         this.paddle_right_y = +pos;
  //     }

  //     const now = Date.now();
  //     var diff = now - this.tick;

  //     if (diff > this.lag) {
  //         while (diff > this.lag) {
  //             var speed = this.ball_speed * (this.lag * 0.001);
  //             this.ball_pos_x += this.ball_dir_x * speed;
  //             this.ball_y += this.ball_dir_y * speed;
  //             diff -= this.lag; 
  //             this.check_collision();
  //         }
  //     } else {
  //         var speed = this.ball_speed * ((now - this.tick) * 0.001);
  //         this.ball_pos_x += this.ball_dir_x * speed;
  //         this.ball_y += this.ball_dir_y * speed;
  //         this.check_collision();
  //     }
  //     this.tick = now;
  //     this.update_clients();
  // }

}