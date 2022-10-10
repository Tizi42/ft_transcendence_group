import Phaser from "phaser";
import GameScene from "@/game/scenes/Game";
import GameOverScene from "@/game/scenes/GameOver";
import GetReadyScene from "@/game/scenes/GetReady";

class GameInfo extends Phaser.Plugins.BasePlugin {
  constructor(pluginManager: Phaser.Plugins.PluginManager) {
    super(pluginManager);
    //initialize player state
  }

  user_id: number;
  room_name: string;

  init(data: any) {
    console.log("plugin data: ", data);
    this.user_id = data.user_id;
    this.room_name = data.room_name;
  }
  //Additional methods for getting managing player data
  isAlive() {
    return true;
  }
}

function launch(containerId: string, data: any) {
  return new Phaser.Game({
    type: Phaser.AUTO,
    width: 1043,
    height: 591,
    physics: {
      default: "arcade",
    },
    parent: containerId,
    backgroundColor: "#1E2B02",
    plugins: {
      global: [
        //make the Player global to all scenes (and other plugins)
        // key is plugin key, plugin is class, start true/false if there
        // is a start method to run, mapping is the name tagged of this
        // to access the plugin class
        {
          key: "GameInfo",
          plugin: GameInfo,
          start: false,
          mapping: "gameInfo",
          data: data,
        },
      ],
    },
    scene: [GetReadyScene, GameScene, GameOverScene],
  });
}

export default launch;
export { launch };
