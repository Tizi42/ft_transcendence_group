<template>
  <div class="game">
    <div @click="initializeGame" class="flex">
      <a class="btn">Initialize</a>
    </div>
    <div @click="searchGame" class="flex">
      <a class="btn">searchGame</a>
    </div>
    <ion-phaser v-bind:game.prop="game" v-bind:initialize.prop="initialize" />
  </div>
</template>

<script lang="ts">
import Phaser from "phaser";
import socket from "../socket";
// import background from "../assets/game_assets/background.png";
// import padle from "../assets/game_assets/padle.png";
// import ball_image from "../assets/game_assets/ball.png";

socket.on("connect", () => {
  console.log(socket.id + " : connected !");
});

socket.on("loged", (to: string) => {
  const socketId = socket.id;
  if (socketId === to) {
    console.log(socket.id + " : loged !");
  }
});

// socket.n("game_found", (to: string) => {
//   const socketId = socket.id;
//   if (socketId === to) {
//     console.log(socket.id + " : game found !");
//   }
// });

socket.emit("login");
let ball: Phaser.Physics.Arcade.Image;
let l_paddle: Phaser.Physics.Arcade.Image;
let r_paddle: Phaser.Physics.Arcade.Image;

let isGameStarted = 0;
let pos = 0;

let player: any;
let other: any;
let initialVelocityX = 100;
let initialVelocityY = 100;
let lastVelX = 0;
let lastVelY = 0;
// let gameConfig: Phaser.Types.Core.GameConfig;

export default {
  data() {
    return {
      initialize: false,
      game: {
        width: 1043,
        height: 591,
        type: Phaser.AUTO,
        physics: {
          default: "arcade",
          arcade: {
            gravity: false,
          },
        },
        scene: {
          preload() {
            this.load.image("background", "background.png");
            this.load.image("padle", "padle.png");
            this.load.image("ball", "ball.png");
          },
          init() {
            this.cameras.main.setBackgroundColor("#1E2B02");
          },
          create() {
            socket.on("game_found", (data) => {
              const socketId = socket.id;
              if (socketId === data.to) {
                console.log(data);
                pos = data.player;
                initialVelocityX = data.ball_speed * data.ball_dir_x;
                initialVelocityY = data.ball_speed * data.ball_dir_y;
                console.log(socket.id + " : game found !");
                isGameStarted = 1;
              }
            });
            socket.on("game_state", (data) => {
              const socketId = socket.id;
              if (socketId === data.to) {
                other.y = data.pos;
                ball.x = data.ball_pos_x;
                ball.y = data.ball_pos_y;
                if (
                  lastVelX != data.ball_dir_x ||
                  lastVelY != data.ball_dir_y
                ) {
                  lastVelX = data.ball_dir_x;
                  lastVelY = data.ball_dir_y;
                  ball.setVelocityX(data.ball_dir_x * data.ball_speed);
                  ball.setVelocityY(data.ball_dir_y * data.ball_speed);
                }
              }
            });
            this.frameTime = 0;
            this.cursors = this.input.keyboard.createCursorKeys();
            this.background = this.add.image(
              this.cameras.main.width / 2,
              this.cameras.main.height / 2,
              "background"
            );
            let scaleX = this.cameras.main.width / this.background.width;
            let scaleY = this.cameras.main.height / this.background.height;
            let scale = Math.max(scaleX, scaleY);
            this.background.setScale(scale);

            l_paddle = this.physics.add.sprite(
              this.cameras.main.width * 0.05,
              this.cameras.main.height * 0.5,
              "padle"
            );
            r_paddle = this.physics.add.sprite(
              this.cameras.main.width * 0.95,
              this.cameras.main.height * 0.5,
              "padle"
            );
            ball = this.physics.add.sprite(
              this.cameras.main.width * 0.5,
              this.cameras.main.height * 0.5,
              "ball"
            );
            ball.setCollideWorldBounds(true);
            ball.setScale(0.8);
            l_paddle.setCollideWorldBounds(true);
            r_paddle.setCollideWorldBounds(true);
            ball.setBounce(1, 1);
            this.physics.add.collider(ball, l_paddle);
            this.physics.add.collider(ball, r_paddle);
            l_paddle.setImmovable(true);
            r_paddle.setImmovable(true);
            socket.emit("queue_register", "normal");
          },
          update() {
            if (isGameStarted == 1) {
              ball.setVelocityX(initialVelocityX);
              ball.setVelocityY(initialVelocityY);
              if (pos == 1) {
                player = l_paddle;
                other = r_paddle;
              } else {
                player = r_paddle;
                other = l_paddle;
              }
              isGameStarted = 2;
            }
            if (isGameStarted == 2) {
              console.log("x = ", ball.x, " y = ", ball.y);
              socket.emit("update_paddle", player.y);
              if (this.cursors.up.isDown) {
                player.setVelocityY(-100);
              } else if (this.cursors.down.isDown) {
                player.setVelocityY(100);
              } else if (this.cursors.up.isUp) {
                player.setVelocityY(0);
              } else if (this.cursors.down.isUp) {
                player.setVelocityY(0);
              }
            }

            //else if (this.cursors.down.isDown) {
            //   l_paddle.setVelocityY(-100);
            // } else if (this.cursors.down.isUp) {
            //   l_paddle.setVelocityY(0);
            // } else {
            //   l_paddle.setVelocityY(0);
            // }
            // if (dir) {
            //   l_paddle.
            // }
          },
        },
      },
    };
  },
  methods: {
    initializeGame() {
      console.log("test");
    },
    searchGame() {
      this.initialize = true;
    },
  },
};
</script>

<script lang="ts" setup>
import { Ref, ref, onBeforeMount } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const profile: Ref<any> = ref("");

onBeforeMount(async () => {
  await fetch("http://localhost:3000/api/private", {
    credentials: "include",
  })
    .then((response) => {
      if (response.status != 200) {
        router.push({
          name: "login",
        });
        return response.json();
      }
      return response.json();
    })
    .then((user) => {
      profile.value = user;
      console.log(user);
    })
    .catch((error) => {
      console.log(error);
    });
});
</script>
