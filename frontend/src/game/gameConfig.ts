import Phaser from "phaser";
import GameScene from "@/game/scenes/Game";
import GameOverScene from "@/game/scenes/GameOver";
import GetReadyScene from "@/game/scenes/GetReady";
import MagicScene from "@/game/scenes/Magic";

// class GameInfo extends Phaser.Plugins.BasePlugin {
//   user_id: number;
//   room_name: string;
//   user_role: string;

//   constructor(pluginManager: Phaser.Plugins.PluginManager) {
//     super(pluginManager);
//     //initialize player state
//   }

//   init(data: any) {
//     console.log("plugin data: ", data);
//     this.user_id = data.user_id;
//     this.room_name = data.room_name;
//     this.user_role = data.user_role;
//   }

//   isAlive() {
//     return true;
//   }
// }
// const canvas = document.createElement("canvas");
// const context =
//   canvas.getContext("2d", { willReadFrequently: true }) || undefined;

function launch(containerId: string, data: any) {
  return new Phaser.Game({
    type: Phaser.AUTO,
    width: 1043,
    height: 591,
    physics: {
      default: "arcade",
    },
    // parent: containerId,
    backgroundColor: "#1E2B02",
    scale: {
      mode: Phaser.Scale.FIT,
      parent: containerId,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 1043,
      height: 591,
    },
    // plugins: {
    //   global: [
    //     // key is plugin key, plugin is class, start true/false if there
    //     // is a start method to run, mapping is the name tagged of this
    //     // to access the plugin class
    //     {
    //       key: "GameInfo",
    //       plugin: GameInfo,
    //       start: false,
    //       mapping: "gameInfo",
    //       data: data,
    //     },
    //   ],
    // },
    // context: context, //	type: CanvasRenderingContext2D
    scene: [GetReadyScene, GameScene, MagicScene, GameOverScene],
  });
}

export default launch;
export { launch };
