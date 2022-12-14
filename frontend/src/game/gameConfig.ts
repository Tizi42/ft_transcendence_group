import Phaser from "phaser";
import GameScene from "@/game/scenes/Game";
import GameOverScene from "@/game/scenes/GameOver";
import GetReadyScene from "@/game/scenes/GetReady";
import MagicScene from "@/game/scenes/Magic";
import SpeedScene from "./scenes/Speed";

function launch(containerId: string) {
  console.log("in launch");
  return new Phaser.Game({
    type: Phaser.AUTO,
    width: 1043,
    height: 591,
    physics: {
      default: "arcade",
    },
    backgroundColor: "#1E2B02",
    scale: {
      mode: Phaser.Scale.CENTER_BOTH,
      parent: containerId,
      autoCenter: Phaser.Scale.CENTER_VERTICALLY,
      max: { width: 1043, height: 591 },
    },
    scene: [GetReadyScene, GameScene, MagicScene, SpeedScene, GameOverScene],
  });
}

export default launch;
export { launch };
