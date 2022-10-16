<template>
  <div class="game-frame">
    <div :id="containerId" />
  </div>
</template>

<script lang="ts" setup>
import {
  defineExpose,
  defineComponent,
  onMounted,
  defineProps,
  onBeforeUnmount,
} from "vue";
import type { Game } from "phaser";
import { useUserStore } from "@/stores/user";
import gameInfo from "@/game/gameInfo";

interface Props {
  room_name: string;
  user_role: string;
  mode: string;
}

const props: Readonly<Props> = defineProps<Props>();
const user = useUserStore();
let gameInstance: Game | null = null;
const containerId = "game-container";
const game = await import("@/game/gameConfig");

onBeforeUnmount(() => {
  // gameInstance.destroy(true, false);
});

onMounted(() => {
  gameInfo.setInfo(user.id, props.room_name, props.user_role, props.mode);
  gameInstance = game.launch(containerId, {
    user_id: user.id,
    room_name: props.room_name,
    user_role: props.user_role,
    mode: props.mode,
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
