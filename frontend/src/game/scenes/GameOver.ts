import Phaser from "phaser";
import socket from "@/socket";
import gameInfo from "../gameInfo";

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameOverScene" });
  }

  winner: string;
  button: Phaser.GameObjects.Sprite;
  text: Phaser.GameObjects.Text;

  i = 0;
  init(data: { winner: string }) {
    this.winner = data.winner;
  }

  preload() {
    this.load.image("restart", "restart.png");
    this.load.image("restart_grey", "restart_grey.png");
  }

  create() {
    if (gameInfo.user_role === "watch") {
      this.button = this.add.sprite(
        this.cameras.main.centerX,
        this.cameras.main.centerY,
        "restart_grey"
      );
      // listen for server instruction to restart watching a game
      socket.once("game_start", () => {
        socket.emit("reset_score", {
          user_id: gameInfo.user_id,
        });
        if (gameInfo.mode === "magic") this.scene.start("MagicScene");
        else if (gameInfo.mode === "speed") this.scene.start("SpeedScene");
        else this.scene.start("GameScene");
      });

      return;
    }

    this.text = this.add.text(
      this.cameras.main.centerX - 90,
      this.cameras.main.centerY - 40,
      "You won!!!",
      { fontSize: "32px", color: "#fff" }
    );

    if (gameInfo.user_role == "watch") {
      this.text.setText("Finished");
    } else if (this.winner == "none") {
      this.text.setText("Draw");
    } else if (gameInfo.user_role !== this.winner) {
      this.text.setText("You lost...");
    }

    this.button = this.add.sprite(
      this.cameras.main.centerX,
      this.cameras.main.centerY + 80,
      "restart"
    );
    this.button.setInteractive();

    // listen on click button
    this.button.on("pointerdown", () => {
      this.scene.start("GetReadyScene");
    });
  }
}
