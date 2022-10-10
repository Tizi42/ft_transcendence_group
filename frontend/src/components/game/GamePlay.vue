<template>
  <div class="game-frame">
    <div :id="containerId" />
  </div>
</template>

<script lang="ts" setup>
import { defineExpose, defineComponent, onMounted, defineProps } from "vue";
import type { Game } from "phaser";
import socket from "@/socket";
import { useUserStore } from "@/stores/user";

interface Props {
  room_name: string;
}

const props: Readonly<Props> = defineProps<Props>();
const user = useUserStore();
let gameInstance: Game | null = null;
const containerId = "game-container";
const game = await import("@/game/game");

onMounted(() => {
  gameInstance = game.launch(containerId, {
    user_id: user.id,
    room_name: props.room_name,
  });
});

defineExpose(
  defineComponent({
    name: "GamePlay",
  })
);
</script>

<style scoped>
.game-frame {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
