import Phaser from "phaser";
import socket from "@/socket";
import { Ball } from "../sprites/ball";
import { Racket } from "../sprites/racket";
import GameStatus from "@/game/type";

export default class GameScene extends Phaser.Scene {
  // ball: Ball;
  // l_racket: Racket;
  // r_racket: Racket;
  // player: Racket;
  // versus: Racket;
  // pos = 0;
  // gameState = -1;
  // cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  // room_name = "";

  ball: Phaser.Physics.Arcade.Sprite;
  paddle_left: Phaser.Physics.Arcade.Sprite;
  paddle_right: Phaser.Physics.Arcade.Sprite;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  paddle_velocity_max = 20;
  paddle_pos: number;
  width: number;
  height: number;

  score_left = 0;
  score_right = 0;
  game_status: GameStatus = "ready";
  ball_velocity: number;

  constructor() {
    super("GameScene");
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
    this.ball_velocity = 350;

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
      this.paddle_left.y = data.paddle_left_velocity;
      this.paddle_right.y = data.paddle_right_velocity;
    });
  }

  update() {
    // const keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    // const keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

    // if (this.game_status === "ready") {
    //   this.launch_ball("toRight");
    //   this.game_status = "running";
    // }

    if (this.cursors.up.isDown) {
      this.update_paddle(-this.paddle_velocity_max);
    } else if (this.cursors.down.isDown) {
      this.update_paddle(this.paddle_velocity_max);
    }
    // else if (this.cursors.up.isUp) {
    //   this.update_paddle(0);
    // } else if (this.cursors.down.isUp) {
    //   this.update_paddle(0);
    // }

    // if (keyW.isDown) {
    //   this.paddle_right.setVelocityY(-250);
    // } else if (keyS.isDown) {
    //   this.paddle_right.setVelocityY(250);
    // } else if (keyW.isUp) {
    //   this.paddle_right.setVelocityY(0);
    // } else if (keyS.isUp) {
    //   this.paddle_right.setVelocityY(0);
    // }

    // const leftBounds = -30;
    // const rightBounds = this.cameras.main.width + 30;

    // if (this.ball.x < leftBounds) {
    //   this.score_right += 1;
    //   this.launch_ball("toLeft");
    // } else if (this.ball.x > rightBounds) {
    //   this.score_left += 1;
    //   this.launch_ball("toRight");
    // }
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
      user_id: this.gameInfo.user_id,
      room_name: this.gameInfo.room_name,
      paddle_velocity: this.paddle_pos,
    });
  }

  launch_ball(direction: string) {
    this.ball.disableBody(true, true);
    this.ball.enableBody(
      true,
      this.cameras.main.centerX,
      Phaser.Math.Between(0, this.cameras.main.height),
      true,
      true
    );
    if (direction === "toLeft") this.ball.setVelocity(-300, 300);
    else this.ball.setVelocity(300, 300);
  }
}
