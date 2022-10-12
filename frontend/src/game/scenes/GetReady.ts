import Phaser from "phaser";
import socket from "@/socket";

export default class GetReadyScene extends Phaser.Scene {
  readyButton: Phaser.Physics.Arcade.Sprite;
  ready = false;

  constructor() {
    super({ key: "GetReadyScene" });
  }

  preload() {
    this.load.image("background", "background.png");
    this.load.image("ball", "ball.png");
    this.load.image("paddle", "paddle.png");
    this.load.image("cancel-ready", "cancel-ready.png");
    this.load.image("get-ready", "get-ready.png");
  }

  create() {
    this.readyButton = this.add.sprite(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      "get-ready"
    );
    this.readyButton.setInteractive();

    // listen on click ready button
    if (this.gameInfo.user_role !== "watch") {
      this.readyButton.on("pointerdown", () => {
        if (this.ready === false) {
          this.readyButton.setTexture("cancel-ready");
          socket.emit("ready", {
            user_id: this.gameInfo.user_id,
            room_name: this.gameInfo.room_name,
          });
        } else {
          this.readyButton.setTexture("get-ready");
          socket.emit("cancel_ready", {
            user_id: this.gameInfo.user_id,
            room_name: this.gameInfo.room_name,
          });
        }
        this.ready = !this.ready;
      });
    }

    // listen for server instruction to start game
    socket.on("game_start", () => {
      console.log("Game start !!!");
      this.scene.start("GameScene");
    });
  }
}
