import { Server } from 'socket.io';
import { clearInterval } from 'timers';
import { BattlesService } from '../../battles/battles.service';
import GameStatus from "./type";

export class GameRoom {

  //current game info
  current_game_id: number;
  current_game_start_time: Date;
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
  readonly hit_range = () : number => { return this.ball_velocity * 0.5 + 1.5 };
  readonly ball_velocity_init = {
    normal: 3.5, // 7.5 pixels per 25ms, 300 pixels per 1000ms
    magic: 3.5,
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
  spell1_L = 0;
  spell2_L = 0;
  spell1_R = 0;
  spell2_R = 0;
  spell_interval: ReturnType<typeof setInterval>;
  spell_spawn_frequencey = 5000;

  paddle_sized_duration = 5000;
  paddle_resize = 15;

  reverse_duration = 5000;
  L_reverse_effect = 1;
  R_reverse_effect = 1;
  
  L_speed_ball = 0;
  R_speed_ball = 0;
  previous_ball_speed = 0;
  speed_ball_factor = 1.5;

  L_shield = 0;
  R_shield = 0;

  eye_effect_duration = 5000;

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
      setTimeout(this.game_end.bind(this), 180000);
    }
    this.current_game_start_time = new Date();
    this.current_game_id = await this.battlesService.addOne({
      opponent1: this.playerL,
      opponent2: this.playerR,
      mode: this.mode,
    });
    this.game_status = "running";
    this.getRandomInt(1) === 1 ? this.on_launch("toRight") : this.on_launch("toLeft");
  }

  on_launch(direction: string)
  {
    console.log("on ball launch");
    if (this.game_status === "ended")
    {
      console.log("nope, game is ended");
      clearInterval(this.interval);
      return;
    }
    // intial ball's launch position and velocity
    this.ball_velocity = this.ball_velocity_init[this.mode];
    const randomHeight = this.getRandomNumberBetween(20, 571); // height 591 - 20 
    const randVelocity = this.getRandomVelocity(direction);
    this.ball_x = this.width / 2;
    this.ball_y = randomHeight;
    this.ball_velocity_x = randVelocity[0];
    this.ball_velocity_y = randVelocity[1];
    // start update
    this.interval = setInterval(this.update_game.bind(this), this.update_frequencey);
    if (this.mode == "magic") {
      this.spell_interval = setInterval(this.spawn_spell.bind(this), this.spell_spawn_frequencey);
    }
  }

  spawn_spell() {
    const spellL = this.getRandomInt(6) + 1;
    const spellR = this.getRandomInt(6) + 1;

    if (!this.spell1_L) this.spell1_L = spellL;
    else if (!this.spell2_L) this.spell2_L = spellL;

    if (!this.spell1_R) this.spell1_R = spellR;
    else if (!this.spell2_R) this.spell2_R = spellR;
    this.server.to(this.room_name).emit("refresh_spells", {
      spell1_L: this.spell1_L,
      spell2_L: this.spell2_L,
      spell1_R: this.spell1_R,
      spell2_R: this.spell2_R,
    });
  }

  on_switch_spell(user_id: number) {
    let tmp: number;
  
    if (this.playerL === user_id) {
      tmp = this.spell2_L;
      this.spell2_L = this.spell1_L;
      this.spell1_L = tmp;
    } else {
      tmp = this.spell2_R;
      this.spell2_R = this.spell1_R;
      this.spell1_R = tmp;
    }
    this.server.to(this.room_name).emit("refresh_spells", {
      spell1_L: this.spell1_L,
      spell2_L: this.spell2_L,
      spell1_R: this.spell1_R,
      spell2_R: this.spell2_R,
    });
  }

  on_spell_lauched(user_id: number)
  {
    let effect = 0;
    let side: string;
    let target: string;

    if (this.playerL === user_id) {
      side = "left";
      target = "right";
    } else if (this.playerR === user_id) {
      side = "right";
      target = "left";
    }

    if (side == "left") {
      if (this.spell1_L) {
        effect = this.spell1_L;
        this.spell1_L = 0;
      } else {
        effect = this.spell2_L;
        this.spell2_L = 0;
      }
    } else {
      if (this.spell1_R) {
        effect = this.spell1_R;
        this.spell1_R = 0;
      } else {
        effect = this.spell2_R;
        this.spell2_R = 0;
      }
    }

    if (effect == 1) {
      this.paddle[side].height_half += this.paddle_resize;
      setTimeout(() => {
        this.paddle[side].height_half -= this.paddle_resize;
        this.server.to(this.room_name).emit("update_paddle_size", {
          left: this.paddle["left"].height_half,
          right: this.paddle["right"].height_half,
        });
      }, this.paddle_sized_duration);
    } else if (effect == 2 && this.paddle[target].height_half > this.paddle_resize) {
      this.paddle[target].height_half -= this.paddle_resize;
      setTimeout(() => {
        this.paddle[target].height_half += this.paddle_resize;
        this.server.to(this.room_name).emit("update_paddle_size", {
          left: this.paddle["left"].height_half,
          right: this.paddle["right"].height_half,
        });
      }, this.paddle_sized_duration);
    } else if (effect == 3) {
      if (side == "left") this.L_speed_ball += 1;
      else this.R_speed_ball += 1;
    } else if (effect == 4) {
      if (target == "left") this.L_reverse_effect = -1;
      else if (target == "right") this.R_reverse_effect = -1;
      setTimeout(() => {
        if (target == "left" && this.L_reverse_effect == -1) this.L_reverse_effect = 1;
        else if (target == "right" && this.R_reverse_effect == -1) this.R_reverse_effect = 1;
      }, this.reverse_duration);
    } else if (effect == 5) {
      if (side == "left") this.L_shield = 1;
      else this.R_shield = 1;
    } else if (effect == 6) {
      setTimeout(() => {
        this.server.to(this.room_name).emit("apply_effect", {
          launcher: side,
          target: target,
          effect: -6,
        });
      }, this.eye_effect_duration);
    }

    if (effect > 2) {
      this.server.to(this.room_name).emit("apply_effect", {
        launcher: side,
        target: target,
        effect: effect,
      });
    } else {
      this.server.to(this.room_name).emit("update_paddle_size", {
        left: this.paddle["left"].height_half,
        right: this.paddle["right"].height_half,
      });
    }
    this.server.to(this.room_name).emit("refresh_spells", {
      spell1_L: this.spell1_L,
      spell2_L: this.spell2_L,
      spell1_R: this.spell1_R,
      spell2_R: this.spell2_R,   
    });
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

    if (side == "left") dir *= this.L_reverse_effect;
    else dir *= this.R_reverse_effect;

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

    // check shields
    if (ball_left < this.leftBounds && this.L_shield) {
        this.ball_velocity_x *= -1;
        this.L_shield = 0;
        this.server.to(this.room_name).emit("apply_effect", {
          launcher: "left",
          target: "right",
          effect: -5,
        });
    } else if (ball_right > this.rightBounds && this.R_shield) {
        this.ball_velocity_x *= -1;
        this.R_shield = 0;
        this.server.to(this.room_name).emit("apply_effect", {
          launcher: "right",
          target: "left",
          effect: -5,
        });
    }

    // check if ball collides with world bound
    if (ball_top < 0 ||
        ball_bottom > this.height) {
        this.ball_velocity_y *= -1;
    }
    // check if ball collides with paddle
    else if (
      ball_left < this.paddle.left.x + this.hit_range() &&
      ball_left > this.paddle.left.x - this.hit_range()  &&
      ball_top < this.paddle.left.y + this.paddle.left.height_half &&
      ball_bottom > this.paddle.left.y - this.paddle.left.height_half
    ){
      this.ball_velocity *= this.acceleration[this.mode];
      if (this.L_speed_ball) {
        if (!this.previous_ball_speed) this.previous_ball_speed = this.ball_velocity;
        this.ball_velocity *= this.speed_ball_factor;
        this.L_speed_ball -= 1;
      } else if (this.previous_ball_speed) {
        this.ball_velocity = this.previous_ball_speed;
        this.previous_ball_speed = 0;
      }
      let bounce_angle = this.max_angle * ((this.ball_y - this.paddle.left.y) / this.paddle.left.height_half);
      this.ball_velocity_x = this.ball_velocity * Math.cos(bounce_angle);
      this.ball_velocity_y = this.ball_velocity * Math.sin(bounce_angle);
    }
    else if (
      ball_right < this.paddle.right.x + this.hit_range() &&
      ball_right > this.paddle.right.x - this.hit_range() &&
      ball_top < this.paddle.right.y + this.paddle.right.height_half &&
      ball_bottom > this.paddle.right.y - this.paddle.right.height_half
    ){
      this.ball_velocity *= this.acceleration[this.mode];
      if (this.R_speed_ball) {
        if (!this.previous_ball_speed) this.previous_ball_speed = this.ball_velocity;
        this.ball_velocity *= this.speed_ball_factor;
        this.R_speed_ball -= 1;
      } else if (this.previous_ball_speed) {
        this.ball_velocity = this.previous_ball_speed;
        this.previous_ball_speed = 0;
      }
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
    if (this.mode == "magic") clearInterval(this.spell_interval);
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
      this.game_end();
      return true;
    }
    return false;
  }

  game_end(){
    this.game_status = "ended";
    if (this.mode === "speed")
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
    this.paddle.left.y = this.height * 0.5;
    this.paddle.right.y = this.height * 0.5;
  }

  // if quit game in the middle
  stop_game() {
    this.game_status = "ended";
    clearInterval(this.interval);
    if (this.mode === "magic")
      clearInterval(this.spell_interval);
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