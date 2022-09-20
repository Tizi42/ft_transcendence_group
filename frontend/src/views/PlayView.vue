<template>
  <div class="container">
    <div @click="searchGame" class="flex">
      <a class="btn p-3 text-center">Play</a>
    </div>
    <ion-phaser v-bind:game.prop="game" v-bind:initialize.prop="initialize" />
  </div>
</template>

<script lang="ts">
import Phaser from "phaser";
import GameScene from "@/game/scenes/Game";

export default {
  data() {
    return {
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
        scene: [GameScene],
      },
    };
  },
  methods: {
    searchGame() {
      console.log("");
    },
  },
};
</script>

<style>
h1 {
  color: white;
}

nav a.router-link-active {
  background-color: rgba(1, 71, 47, 1);
  height: 200px;
}
</style>
