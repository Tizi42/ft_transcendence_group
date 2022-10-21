import Phaser from "phaser";
import socket from "@/socket";
import gameInfo from "../gameInfo";

export default class MagicScene extends Phaser.Scene {
  width: number;
  height: number;

  ball: Phaser.Physics.Arcade.Sprite;
  paddle_left: Phaser.Physics.Arcade.Sprite;
  paddle_right: Phaser.Physics.Arcade.Sprite;
  spell_left: Phaser.GameObjects.Sprite;
  spell_right: Phaser.GameObjects.Sprite;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  spell_time = 0;
  active_spell = 0;

  paddle_left_effect = 0;
  paddle_right_effect = 0;
  paddle_left_time = -1;
  paddle_right_time = -1;
  paddle_left_size = 1;
  paddle_right_size = 1;

  reverse_effect = 0;
  reverse_time = -1;

  spell_spawn_timing = 5000;

  constructor() {
    super("MagicScene");
  }

  init() {
    this.spell_time = 0;
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

    // set up spellboard
    this.add.image(this.width * 0.45, this.height * 0.1, "spellboard");
    this.add.image(this.width * 0.56, this.height * 0.1, "spellboard");

    // set up spell
    this.spell_left = this.add.sprite(
      this.width * 0.45,
      this.height * 0.1,
      "spell"
    );
    this.spell_right = this.add.sprite(
      this.width * 0.56,
      this.height * 0.1,
      "spell"
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

    socket.on("new_spell", (data: any) => {
      console.log(data.spell_L);
      console.log(data.spell_R);
      this.spell_left.setFrame(data.spell_L);
      this.spell_right.setFrame(data.spell_R);
      if (gameInfo.user_id === data.to) {
        this.active_spell = data.spell_L;
      } else {
        this.active_spell = data.spell_R;
      }
    });

    socket.on("apply_effect", (data: any) => {
      this.spell_left.setFrame(data.spell_L);
      this.spell_right.setFrame(data.spell_R);
      if (gameInfo.user_id === data.to) {
        if (data.effect === 4) {
          if (gameInfo.user_role === "left") {
            this.reverse_effect = 1;
          } else {
            this.reverse_effect = 1;
          }
        }
      }
      if (data.effect === 2) {
        if (data.side === -1) {
          if (this.paddle_left_size > 0.25) {
            this.paddle_left_effect += 1;
            this.paddle_left_size -= 0.25;
            this.paddle_left.setScale(1, this.paddle_left_size);
          }
        } else {
          if (this.paddle_right_size > 0.25) {
            this.paddle_right_effect += 1;
            this.paddle_right_size -= 0.25;
            this.paddle_right.setScale(1, this.paddle_right_size);
          }
        }
      }
    });
  }

  update(time: number, delta: number) {
    this.spell_time += delta;
    if (gameInfo.user_role === "left") {
      if (this.spell_time > this.spell_spawn_timing) {
        this.spell_time = 0;
        const spell_L = Phaser.Math.Between(1, 6);
        const spell_R = Phaser.Math.Between(1, 6);
        socket.emit("create_spell", {
          room_name: gameInfo.room_name,
          spell_L: spell_L,
          spell_R: spell_R,
        });
      }
    }
    this.check_effect(time);
    let dir = 1;
    if (this.reverse_effect) {
      dir = -1;
    }
    console.log(dir);
    if (this.cursors.up.isDown) {
      this.update_paddle(-dir);
    } else if (this.cursors.down.isDown) {
      this.update_paddle(dir);
    } else if (this.cursors.space.isDown && this.active_spell) {
      console.log("use spell : ", this.active_spell);
      this.active_spell = 0;
      socket.emit("launch_spell", {
        user_id: gameInfo.user_id,
        room_name: gameInfo.room_name,
      });
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

  check_effect(time: number) {
    if (this.paddle_right_effect) {
      if (this.paddle_right_time == -1) this.paddle_right_time = time;
      else if (this.paddle_right_time + 3000 < time) {
        this.paddle_right_time = -1;
        this.paddle_right_effect -= 1;
        this.paddle_right_size += 0.25;
        this.paddle_right.setScale(1, this.paddle_right_size);
      }
    } else if (this.paddle_left_effect) {
      if (this.paddle_left_time == -1) this.paddle_left_time = time;
      else if (this.paddle_left_time + 3000 < time) {
        this.paddle_left_time = -1;
        this.paddle_left_effect -= 1;
        this.paddle_left_size += 0.25;
        this.paddle_left.setScale(1, this.paddle_left_size);
      }
    } else if (this.reverse_effect) {
      if (this.reverse_time == -1) this.reverse_time = time;
      else if (this.reverse_time + 5000 < time) {
        this.reverse_time = -1;
        this.reverse_effect = 0;
      }
    }
  }
}
