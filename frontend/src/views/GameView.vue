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
import background from "../assets/game_assets/background.png";
import padle from "../assets/game_assets/padle.png";
import ball_image from "../assets/game_assets/ball.png";

function tempCheck(to: string): boolean {
  return true;
}

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
var ball;
var l_paddle;
var r_paddle;
var isGameStarted = false;

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
            socket.on("game_found", (to: string) => {
              const socketId = socket.id;
              if (socketId === to) {
                console.log(socket.id + " : game found !");
              }
            });
            this.cursors = this.input.keyboard.createCursorKeys();
            this.background = this.add.image(
              this.cameras.main.width / 2,
              this.cameras.main.height / 2,
              "background"
            );
            var scaleX = this.cameras.main.width / this.background.width;
            var scaleY = this.cameras.main.height / this.background.height;
            var scale = Math.max(scaleX, scaleY);
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
            if (!isGameStarted) {
              const initialVelocityX = 100;
              const initialVelocityY = 100;

              ball.setVelocityX(initialVelocityX);
              ball.setVelocityY(initialVelocityY);
              isGameStarted = true;
            }
            if (ball.body.x < l_paddle.body.x) {
              console.log("player 1 win");
            }
            if (ball.body.x > r_paddle.body.x) {
              console.log("player 2 win");
            }
            if (this.cursors.up.isDown) {
              l_paddle.setVelocityY(-100);
            } else if (this.cursors.down.isDown) {
              l_paddle.setVelocityY(100);
            } else if (this.cursors.up.isUp) {
              l_paddle.setVelocityY(0);
            } else if (this.cursors.down.isUp) {
              l_paddle.setVelocityY(0);
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
