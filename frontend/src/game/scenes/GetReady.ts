import Phaser from "phaser";
import socket from "@/socket";
import gameInfo from "../gameInfo";

export default class GetReadyScene extends Phaser.Scene {
  readyButton: Phaser.GameObjects.Sprite;
  ready = false;
  i = 0;

  constructor() {
    console.log("construct get ready scene");
    super({ key: "GetReadyScene" });
  }

  init() {
    console.log("init get ready scene", this.i++);
    this.ready = false;
    socket.emit("reset_score", {
      user_id: gameInfo.user_id,
    });
  }

  preload() {
    console.log("preload get ready scene");
    this.load.image("background", "background.png");
    this.load.image("magicbackground", "magic_background.png");
    this.load.image("shieldL", "shieldL.png");
    this.load.image("shieldR", "shieldR.png");
    this.load.image("ball", "ball.png");
    this.load.image("spellboardL", "spellboardL.png");
    this.load.image("spellboardR", "spellboardR.png");
    this.load.spritesheet({
      key: "spell",
      url: "spritesheet_small_with_transparent.png",
      frameConfig: {
        frameWidth: 320,
        frameHeight: 320,
      },
    });
    this.load.image("paddle", "paddle.png");
    this.load.image("cancel-ready", "cancel-ready.png");
    this.load.image("get-ready", "get-ready.png");
    this.load.image("not_ready_grey", "not_ready_grey.png");
  }

  create() {
    console.log("create get ready scene");
    if (gameInfo.user_role === "watch") {
      this.readyButton = this.add.sprite(
        this.cameras.main.centerX,
        this.cameras.main.centerY,
        "not_ready_grey"
      );
      socket.emit(
        "get_game_status",
        {
          room_name: gameInfo.room_name,
        },
        (data: any) => {
          if (data.game_status === "running") this.start_game_scene();
        }
      );
    } else {
      this.readyButton = this.add.sprite(
        this.cameras.main.centerX,
        this.cameras.main.centerY,
        "get-ready"
      );
      this.readyButton.setInteractive();

      // listen on click ready button
      this.readyButton.on("pointerdown", () => {
        if (this.ready === false) {
          this.readyButton.setTexture("cancel-ready");
          socket.emit("ready", {
            user_id: gameInfo.user_id,
            room_name: gameInfo.room_name,
          });
        } else {
          this.readyButton.setTexture("get-ready");
          socket.emit("cancel_ready", {
            user_id: gameInfo.user_id,
            room_name: gameInfo.room_name,
          });
        }
        this.ready = !this.ready;
      });
    }

    // listen for server instruction to start game
    socket.on("game_start", () => {
      console.log("game_start rand", Math.random());
      this.start_game_scene();
    });
  }

  start_game_scene() {
    console.log("Game start !!!", this.scene);
    if (gameInfo.mode === "magic") this.scene.start("MagicScene");
    else if (gameInfo.mode === "speed") this.scene.start("SpeedScene");
    else this.scene.start("GameScene");
  }
}
