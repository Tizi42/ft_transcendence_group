import Phaser from "phaser";
import GameScene from "@/game/scenes/Game";
import GameOverScene from "@/game/scenes/GameOver";
import GetReadyScene from "@/game/scenes/GetReady";

function launch(containerId: string) {
  return new Phaser.Game({
    type: Phaser.AUTO,
    width: 1043,
    height: 591,
    physics: {
      default: "arcade",
    },
    parent: containerId,
    backgroundColor: "#1E2B02",
    scene: [GameScene, GameOverScene],
  });
}

export default launch;
export { launch };
