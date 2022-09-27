<template>
  <div class="game-frame">
    <button @click="initializeGame">Initialize</button>
    <button @click="searchGame">Search</button>
    <ion-phaser
      v-bind:game.prop="gameConfig"
      v-bind:initialize.prop="initialize"
    />
  </div>
</template>

<script lang="ts" setup>
import { defineExpose, defineComponent, ref } from "vue";
import Phaser from "phaser";
import GameScene from "@/game/scenes/Game";

let gameConfig: Phaser.Types.Core.GameConfig = {
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
};

const initialize = ref(false);

function initializeGame() {
  console.log("test");
}

function searchGame() {
  initialize.value = true;
}

defineExpose(
  defineComponent({
    name: "GamePlay",
  })
);
</script>
