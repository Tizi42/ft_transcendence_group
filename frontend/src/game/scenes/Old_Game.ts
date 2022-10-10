import Phaser from "phaser";
import socket from "@/socket";
import { Ball } from "../sprites/ball";
import { Racket } from "../sprites/racket";

export default class Pong extends Phaser.Scene {
  ball: Ball;
  l_racket: Racket;
  r_racket: Racket;
  player: Racket;
  versus: Racket;
  pos = 0;
  gameState = -1;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  room_name = "";

  constructor() {
    super("GameScene");
  }

  init() {
    this.cameras.main.setBackgroundColor("#1E2B02");
  }

  preload() {
    this.load.image("background", "background.png");
    this.load.image("ball", "ball.png");
    this.load.image("racket", "racket.png");
  }

  create() {
    // socket.on("game_found", (data) => {
    //   console.log(socket.id, " game found !");
    //   this.room_name = data.room_name;
    //   const socketId = socket.id;
    //   if (socketId === data.to) {
    //     this.pos = data.player;
    //     this.ball.initialVelocityX = data.ball_speed * data.ball_dir_x;
    //     this.ball.initialVelocityY = data.ball_speed * data.ball_dir_y;
    //     this.gameState = 1;
    //   }
    // });
    // socket.on("game_state", (data) => {
    //   if (this.room_name != data.room_name) {
    //     this.room_name = data.room_name;
    //   }
    //   console.log(socket.id, " update !");
    //   const socketId = socket.id;
    //   if (socketId === data.to) {
    //     this.versus.y = data.pos;
    //     this.ball.update_state(
    //       data.ball_pos_x,
    //       data.ball_pos_y,
    //       data.ball_dir_x,
    //       data.ball_dir_y,
    //       data.ball_speed
    //     );
    //   }
    // });
    this.cursors = this.input.keyboard.createCursorKeys();
    const background = this.add.image(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      "background"
    );
    this.ball = new Ball(
      this,
      this.cameras.main.width * 0.5,
      this.cameras.main.height * 0.5
    );
    this.l_racket = new Racket(
      this,
      this.cameras.main.width * 0.05,
      this.cameras.main.height * 0.5
    );
    this.r_racket = new Racket(
      this,
      this.cameras.main.width * 0.95,
      this.cameras.main.height * 0.5
    );
    this.physics.add.collider(this.ball, this.l_racket);
    this.physics.add.collider(this.ball, this.r_racket);
  }

  update() {
    if (this.gameState == 1) {
      this.ball.update_velocity();
      if (this.pos == 1) {
        this.player = this.l_racket;
        this.versus = this.r_racket;
      } else {
        this.player = this.r_racket;
        this.versus = this.r_racket;
      }
      this.gameState = 2;
    } else if (this.gameState == 2 && this.room_name != "") {
      // console.log(this.room_name);
      // socket.emit("update_pos", this.room_name, this.player.y);
      if (this.cursors.up.isDown) {
        this.player.setVelocityY(-100);
      } else if (this.cursors.down.isDown) {
        this.player.setVelocityY(100);
      } else if (this.cursors.up.isUp) {
        this.player.setVelocityY(0);
      } else if (this.cursors.down.isUp) {
        this.player.setVelocityY(0);
      }
    }
  }
}
