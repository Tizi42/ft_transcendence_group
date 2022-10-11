<template>
  <div class="gameBox">
    <Suspense>
      <GamePlay :room_name="room_name" :watch_mode="watch_mode" />
      <template #fallback>
        <div class="placeholder">Downloading ...</div>
      </template>
    </Suspense>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, defineExpose, defineProps } from "vue";
import GamePlay from "./GamePlay.vue";

interface Props {
  room_name: string;
  watch_mode: boolean;
}

defineProps<Props>();

defineExpose(
  defineComponent({
    name: "GameBox",
  })
);
</script>

<style scoped>
.gameBox {
  width: 70%;
  height: 70%;
  background: #1e2b02;
  border: 5px solid #ffcb00;
  border-radius: 22px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}

.container {
  position: relative;
  padding: 0;
}
</style>
