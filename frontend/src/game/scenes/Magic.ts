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

  spell1 = 0;
  spell2 = 0;
  active_spell = 0;

  paddle_left_size = 1;
  paddle_right_size = 1;

  Lpaddle_eye_effect = 0;
  Lpaddle_alpha = 1;
  Rpaddle_eye_effect = 0;
  Rpaddle_alpha = 1;

  constructor() {
    super("MagicScene");
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

    socket.on("refresh_spells", (data: any) => {
      this.spell_left.setFrame(data.spell1_L);
      this.spell_right.setFrame(data.spell1_R);
      if (gameInfo.user_role === "left") {
        this.spell1 = data.spell1_L;
        this.spell2 = data.spell2_L;
      } else {
        this.spell1 = data.spell1_R;
        this.spell2 = data.spell2_R;
      }
    });
    socket.on("update_paddle_size", (data: any) => {
      this.paddle_left.setScale(1, data.left / 40);
      this.paddle_right.setScale(1, data.right / 40);
    });

    socket.on("apply_effect", (data: any) => {
      if (data.effect == 6) {
        if (data.target == "left") this.Lpaddle_eye_effect = 1;
        else this.Rpaddle_eye_effect = 1;
      } else if (data.effect == -6) {
        if (data.target == "left") {
          this.Lpaddle_eye_effect = 0;
          this.Lpaddle_alpha = 1;
          this.paddle_left.alpha = 1;
        } else {
          this.Rpaddle_eye_effect = 0;
          this.Rpaddle_alpha = 1;
          this.paddle_right.alpha = 1;
        }
      }
    });
  }

  update(time: number, delta: number) {
    if (this.Lpaddle_eye_effect) {
      if (this.Lpaddle_alpha <= 0) this.Lpaddle_alpha = 1;
      else this.Lpaddle_alpha -= 0.05;
      this.paddle_left.alpha = this.Lpaddle_alpha;
    } else if (this.Rpaddle_eye_effect) {
      if (this.Rpaddle_alpha <= 0) this.Rpaddle_alpha = 1;
      else this.Rpaddle_alpha -= 0.05;
      this.paddle_right.alpha = this.Rpaddle_alpha;
    }

    if (this.cursors.up.isDown) {
      this.update_paddle(-1);
    } else if (this.cursors.down.isDown) {
      this.update_paddle(1);
    } else if (this.cursors.shift.isDown) {
      socket.emit("launch_spell", {
        user_id: gameInfo.user_id,
        room_name: gameInfo.room_name,
        spell_slot: this.active_spell,
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
}
