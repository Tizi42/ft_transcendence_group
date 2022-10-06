<template>
  <div class="game-room">
    <div>Player left: {{player_left.id}} {{player_left.name}} </div>
    <div class="score">{{ score_left }} : {{ score_right }}</div>
    <div>Player right: {{player_right.id}} {{player_right.name}}</div>
    <GamePlay :status="status" />
    <button @click="onFindGame">Play!</button>
    <button @click="onReady">Ready</button>
  </div>
</template>

<script lang="ts" setup>
import { defineExpose, defineComponent, ref } from "vue";
import socket from "@/socket";
import GamePlay from "GamePlay.vue"
import GameStatus from "@/game/type"

interface Player {
  name: string;
  id: number;
}

const statu: Ref<GameStatus> = ref("not_ready");
const score_left = ref(0);
const score_right = ref(0);
let player_left: Player;
let player_right: Player;

function onFindGame() {
  socket.emit("queue_register");
}

socket.on("game_found", (data) => {
  console.log("Game found ! ", data);
  player_left = data.player_left;
  player_right = data.player_right;
});

function onReady() {
  socket.emit("ready");
}

socket.on("game_start", () => {
  status.value = "ready";
});


defineExpose(
  defineComponent({
    name: "GameRoom",
  })
);
</script>