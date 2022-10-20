import Phaser from "phaser";
import socket from "@/socket";
import { Ball } from "../sprites/ball";
import { Racket } from "../sprites/racket";
import GameStatus from "@/game/type";
import gameInfo from "../gameInfo";

export default class GameScene extends Phaser.Scene {
  width: number;
  height: number;

  ball: Phaser.Physics.Arcade.Sprite;
  paddle_left: Phaser.Physics.Arcade.Sprite;
  paddle_right: Phaser.Physics.Arcade.Sprite;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  paddle_pos: number;
  paddle_velocity_max = 10;

  winner: string;
  score_left: number;
  score_right: number;
  game_status: GameStatus;

  constructor() {
    super("GameScene");
  }

  init() {
    this.game_status = "ready";
    this.score_left = 0;
    this.score_right = 0;
    this.winner = "";
  }

  create() {
    this.width = this.cameras.main.width;
    this.height = this.cameras.main.height;

    // set up background
    this.add.image(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      "background"
    );

    // set up world bounds
    this.physics.world.setBounds(-100, 0, this.width + 200, this.height);

    // set up ball
    this.ball = this.physics.add.sprite(
      this.width * 0.5,
      this.height * 0.5,
      "ball"
    );
    this.ball.setCollideWorldBounds(true);
    this.ball.setScale(0.8);
    this.ball.setBounce(1, 1);

    // set up paddles
    this.paddle_left = this.create_paddle(this.width * 0.02, this.height * 0.5);

    this.paddle_right = this.create_paddle(
      this.width * 0.98,
      this.height * 0.5
    );

    this.paddle_pos = this.height * 0.5;

    //  set up input event
    this.cursors = this.input.keyboard.createCursorKeys();

    // collide ball with paddle
    this.physics.add.collider(this.ball, this.paddle_left);
    this.physics.add.collider(this.ball, this.paddle_right);

    // listen for update
    socket.on("game_update", (data: any) => {
      this.paddle_left.y = data.paddle_left_posY;
      this.paddle_right.y = data.paddle_right_posY;
    });

    // socket.on("ball_update", (data: any) => {
    //   this.ball.x = data.ball_x;
    //   this.ball.y = data.ball_y;
    //   // this.ball.setVelocity(data.vx, data.vy);
    // });

    socket.on("launch_ball", (data: any) => {
      this.ball.disableBody(true, true);
      this.ball.enableBody(
        true,
        this.cameras.main.centerX,
        data.randomHeight,
        true,
        true
      );
      this.ball.setVelocity(data.randVx, data.randVy);
    });

    if (gameInfo.user_role !== "left") {
      socket.on("end", (data: any) => {
        this.winner = data.winner;
        this.scene.start("GameOverScene", { winner: this.winner });
      });
    }
  }

  update() {
    if (gameInfo.user_role === "left") {
      if (this.game_status === "ready") {
        this.launch_ball("toRight");
        this.game_status = "running";
      }
    }

    this.check_score();
    // this.update_ball();

    if (this.cursors.up.isDown) {
      this.update_paddle(-this.paddle_velocity_max);
    } else if (this.cursors.down.isDown) {
      this.update_paddle(this.paddle_velocity_max);
    }
  }

  create_paddle(x: number, y: number) {
    const paddle = this.physics.add.sprite(x, y, "paddle");
    paddle.setCollideWorldBounds(true);
    paddle.setImmovable(true);
    return paddle;
  }

  update_paddle(velocity: number) {
    this.paddle_pos += velocity;
    if (this.paddle_pos <= 40) {
      this.paddle_pos = 40;
    } else if (this.paddle_pos >= this.height - 40) {
      this.paddle_pos = this.height - 40;
    }
    socket.emit("update_paddle", {
      user_id: gameInfo.user_id,
      room_name: gameInfo.room_name,
      paddle_pos: this.paddle_pos,
    });
  }

  launch_ball(direction: string) {
    // const randomHeight = Phaser.Math.Between(80, this.cameras.main.height - 80);
    // const randVx = Phaser.Math.Between(200, 300);
    // const randVy = Phaser.Math.Between(200, 300);

    // this.ball.disableBody(true, true);
    // // add: emit to back and get three random numbers
    // this.ball.enableBody(
    //   true,
    //   this.cameras.main.centerX,
    //   randomHeight,
    //   true,
    //   true
    // );
    // if (direction === "toLeft") this.ball.setVelocity(-randVx, randVy);
    // else this.ball.setVelocity(randVx, randVy);
    socket.emit("launch_ball", {
      room_name: gameInfo.room_name,
      direction: direction,
      mode: gameInfo.mode,
    });
  }

  check_score() {
    const leftBounds = -30;
    const rightBounds = this.cameras.main.width + 30;

    if (this.ball.x < leftBounds) {
      this.ball.disableBody(true, true);
      if (gameInfo.user_role !== "left") return;
      this.launch_ball("toLeft");
      this.score_right += 1;
      this.update_score();
    } else if (this.ball.x > rightBounds) {
      this.ball.disableBody(true, true);
      if (gameInfo.user_role !== "left") return;
      this.launch_ball("toRight");
      this.score_left += 1;
      this.update_score();
    }
  }

  // update_ball() {
  //   socket.emit("ball_pos", {
  //     room_name: gameInfo.room_name,
  //     ball_x: this.ball.x,
  //     ball_y: this.ball.y,
  //     vx: this.ball.body.velocity.x,
  //     vy: this.ball.body.velocity.y,
  //   });
  // }

  update_score() {
    socket.emit("update_score", {
      room_name: gameInfo.room_name,
      left: this.score_left,
      right: this.score_right,
    });

    if (
      (this.score_left >= 11 || this.score_right >= 11) && // change 2 to 11
      Math.abs(this.score_left - this.score_right) >= 2 // change 0 to 2
    ) {
      this.game_end();
    }
  }

  game_end() {
    if (this.score_left > this.score_right) this.winner = "left";
    else this.winner = "right";
    socket.emit("game_end", {
      room_name: gameInfo.room_name,
      winner: this.winner,
      left: this.score_left,
      right: this.score_right,
    });
    this.scene.start("GameOverScene", { winner: this.winner });
  }
}
