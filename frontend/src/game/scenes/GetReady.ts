import Phaser from "phaser";
import socket from "@/socket";
import gameInfo from "../gameInfo";

export default class GetReadyScene extends Phaser.Scene {
  readyButton: Phaser.Physics.Arcade.Sprite;
  ready = false;

  constructor() {
    console.log("construct get ready scene");
    super({ key: "GetReadyScene" });
  }

  init() {
    console.log("init get ready scene");
    this.ready = false;
    socket.emit("reset_score", {
      user_id: gameInfo.user_id,
    });
  }

  preload() {
    console.log("preload get ready scene");
    this.load.image("background", "background.png");
    this.load.image("ball", "ball.png");
    this.load.spritesheet({
      key: "spell",
      url: "spell.png",
      frameConfig: {
        frameWidth: 64,
        frameHeight: 64,
        startFrame: 0,
        endFrame: 6,
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
    } else {
      this.readyButton = this.add.sprite(
        this.cameras.main.centerX,
        this.cameras.main.centerY,
        "get-ready"
      );
      this.readyButton.setInteractive();

      // listen on click ready button
      this.readyButton.on("pointerdown", () => {
        console.log("test ", gameInfo.mode);
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
      console.log("user_id = ", gameInfo.user_id);
      console.log("mode = ", gameInfo.mode);
      console.log("Game start !!!", this.scene);
      if (gameInfo.mode == "normal") this.scene.start("GameScene");
      else this.scene.start("MagicScene");
    });
  }
}
