<template>
  <button @click="onFindGame">Start game</button>
</template>

<script lang="ts" setup>
import { defineComponent, defineExpose } from "vue";
import socket from "@/socket";
import { useRouter } from "vue-router";

const router = useRouter();

function onFindGame() {
  socket.emit("queue_register");
}

socket.on("game_found", () => {
  router.push({
    name: "game_room",
  });
});

defineExpose(
  defineComponent({
    name: "PreGame",
  })
);
</script>