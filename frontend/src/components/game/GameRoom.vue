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
import { defineComponent, ref, Ref } from "vue";
import socket from "@/socket";
import GameStatus from "@/game/type"
import GamePlay from "./GamePlay.vue"

interface Player {
  name: string;
  id: number;
}

const status: Ref<GameStatus> = ref("not_ready");
const score_left = ref(0);
const score_right = ref(0);
let player_left: Player = {
  name: "tmp1",
  id: -1
};
let player_right: Player= {
  name: "tmp1",
  id: -1
};

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