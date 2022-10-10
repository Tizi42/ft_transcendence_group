import { Scene } from "phaser";
// import readyButton from '@/assets/game/getready.png'
// import bomb from '@/assets/game/assets/ready.png'
// import thudMp3 from '@/assets/game/assets/thud.mp3'
// import thudOgg from '@/assets/game/assets/thud.ogg'

export default class GetReadyScene extends Scene {
  constructor() {
    super({ key: "GetReadyScene" });
  }

  preload() {
    // this.load.image('sky', sky)
    // this.load.image('bomb', bomb)
    // this.load.audio('thud', [thudMp3, thudOgg])
  }

  create() {
    // this.scene.start('PlayScene')
  }
}
