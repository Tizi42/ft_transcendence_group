import Phaser from "phaser";
import socket from "@/socket";
import gameInfo from "../gameInfo";

export default class MagicScene extends Phaser.Scene {
  width: number;
  height: number;
  ball: Phaser.Physics.Arcade.Sprite;
  paddle_left: Phaser.Physics.Arcade.Sprite;
  paddle_right: Phaser.Physics.Arcade.Sprite;
  spell1_left: Phaser.GameObjects.Sprite;
  spell2_left: Phaser.GameObjects.Sprite;
  spell1_right: Phaser.GameObjects.Sprite;
  spell2_right: Phaser.GameObjects.Sprite;
  shield_left: Phaser.GameObjects.Sprite;
  shield_right: Phaser.GameObjects.Sprite;
  keyLeft: Phaser.Input.Keyboard.Key;
  keyUp: Phaser.Input.Keyboard.Key;
  keyRight: Phaser.Input.Keyboard.Key;
  keyDown: Phaser.Input.Keyboard.Key;
  keyShift: Phaser.Input.Keyboard.Key;

  switch_time = 0;
  cast_time = 0;
  spell1 = 0;
  spell2 = 0;

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
      "magicbackground"
    );

    // set up spellboard
    this.add.image(this.width * 0.4345, this.height * 0.127, "spellboardL");
    this.add.image(this.width * 0.5755, this.height * 0.127, "spellboardR");

    this.shield_left = this.add.sprite(
      this.width * 0.025,
      this.height * 0.5,
      "shieldL"
    );
    this.shield_left.alpha = 0;

    this.shield_right = this.add.sprite(
      this.width * 0.975,
      this.height * 0.5,
      "shieldR"
    );
    this.shield_right.alpha = 0;

    // set up spell
    this.spell2_left = this.add.sprite(
      this.width * 0.42,
      this.height * 0.153,
      "spell"
    );
    this.spell1_left = this.add.sprite(
      this.width * 0.45,
      this.height * 0.1,
      "spell"
    );
    this.spell2_right = this.add.sprite(
      this.width * 0.59,
      this.height * 0.153,
      "spell"
    );
    this.spell1_right = this.add.sprite(
      this.width * 0.56,
      this.height * 0.1,
      "spell"
    );
    this.spell1_left.setScale(0.2);
    this.spell2_left.setScale(0.2);
    this.spell1_right.setScale(0.2);
    this.spell2_right.setScale(0.2);

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
    this.keyLeft = this.input.keyboard.addKey(37);
    this.keyUp = this.input.keyboard.addKey(38);
    this.keyRight = this.input.keyboard.addKey(39);
    this.keyDown = this.input.keyboard.addKey(40);
    this.keyShift = this.input.keyboard.addKey(16);

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
      this.before_change_scene();
      this.scene.start("GameOverScene", { winner: data.winner });
    });

    socket.on("refresh_spells", (data: any) => {
      this.spell1_left.setFrame(data.spell1_L);
      this.spell2_left.setFrame(data.spell2_L);
      this.spell1_right.setFrame(data.spell1_R);
      this.spell2_right.setFrame(data.spell2_R);
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
      } else if (data.effect == 5) {
        if (data.launcher == "left") this.shield_left.alpha = 1;
        else this.shield_right.alpha = 1;
      } else if (data.effect == -5) {
        if (data.launcher == "left") this.shield_left.alpha = 0;
        else this.shield_right.alpha = 0;
      }
    });
  }

  update(time: number, delta: number) {
    this.switch_time += delta;
    this.cast_time += delta;
    if (this.Lpaddle_eye_effect) {
      if (this.Lpaddle_alpha <= -0.8) this.Lpaddle_alpha = 1;
      else this.Lpaddle_alpha -= 0.05;
      if (this.Lpaddle_alpha >= 0) this.paddle_left.alpha = this.Lpaddle_alpha;
    } else if (this.Rpaddle_eye_effect) {
      if (this.Rpaddle_alpha <= -0.8) this.Rpaddle_alpha = 1;
      else this.Rpaddle_alpha -= 0.05;
      if (this.Rpaddle_alpha >= 0) this.paddle_right.alpha = this.Rpaddle_alpha;
    }

    if (this.keyUp.isDown) {
      this.update_paddle(-1);
    } else if (this.keyDown.isDown) {
      this.update_paddle(1);
    } else if (this.keyLeft.isDown || this.keyRight.isDown) {
      if (this.switch_time > 200) {
        this.switch_time = 0;
        socket.emit("switch_spell", {
          user_id: gameInfo.user_id,
          room_name: gameInfo.room_name,
        });
      }
    } else if (this.keyShift.isDown) {
      if (this.cast_time > 200) {
        this.cast_time = 0;
        socket.emit("launch_spell", {
          user_id: gameInfo.user_id,
          room_name: gameInfo.room_name,
        });
      }
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

  before_change_scene() {
    socket.off("game_update");
    socket.off("end");
    socket.off("refresh_spells");
    socket.off("update_paddle_size");
    socket.off("apply_effect");
  }
}
