<template>
  <div class="game">
    <div @click="initializeGame" class="flex">
      <a href="#1" class="btn">Initialize</a>
    </div>
    <ion-phaser v-bind:game.prop="game" v-bind:initialize.prop="initialize" />
  </div>
</template>

<script lang="ts">
import Phaser from "phaser";
import socket from "../socket";

function test() {
  console.log("PROUT");
}

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
    socket.emit("queue_register", "normal");
  }
});

socket.on("game_found", (to: string) => {
  const socketId = socket.id;
  if (socketId === to) {
    console.log(socket.id + " : game found !");
  }
});

socket.emit("login");

export default {
  data() {
    return {
      initialize: false,
      game: {
        width: "60%",
        height: "80%",
        type: Phaser.AUTO,
        scene: {
          init() {
            this.cameras.main.setBackgroundColor("#1E2B02");
          },
          create() {
            test();
            this.helloWorld = this.add.text(
              this.cameras.main.centerX,
              this.cameras.main.centerY,
              "Hello World",
              { font: "40px Arial", fill: "#ffffff" }
            );
            this.helloWorld.setOrigin(0.5);
          },
          update() {
            this.helloWorld.angle += 1;
          },
        },
      },
    };
  },
  methods: {
    initializeGame() {
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
