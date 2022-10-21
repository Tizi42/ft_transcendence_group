import Phaser from "phaser";
import socket from "@/socket";
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
      this.ball.x = data.ball_x;
      this.ball.y = data.ball_y;
    });

    // listen for game end
    socket.on("end", (data: any) => {
      this.scene.start("GameOverScene", { winner: data.winner });
    });
  }

  update() {
    if (this.cursors.up.isDown) {
      this.update_paddle(-1);
    } else if (this.cursors.down.isDown) {
      this.update_paddle(1);
    }
  }

  create_paddle(x: number, y: number) {
    const paddle = this.physics.add.sprite(x, y, "paddle");
    paddle.setCollideWorldBounds(true);
    paddle.setImmovable(true);
    return paddle;
  }

  update_paddle(dir: number) {
    if (gameInfo.user_role !== "watch") {
      socket.emit("update_paddle", {
        user_id: gameInfo.user_id,
        room_name: gameInfo.room_name,
        paddle_move_direction: dir,
      });
    }
  }
}
