<template>
  <div class="gameBox">
    <Suspense>
      <GamePlay :room_name="room_name" :user_role="user_role" :mode="mode" />
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
  user_role: string;
  mode: string;
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
  width: 1043px;
  height: 591px;
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
