<template>
  <div class="game-frame">
    <div :id="containerId" />
  </div>
</template>

<script lang="ts" setup>
import { defineExpose, defineComponent, onMounted, defineProps } from "vue";
import { useUserStore } from "@/stores/user";
import gameInfo from "@/game/gameInfo";
import { StoreGeneric } from "pinia";

interface Props {
  room_name: string;
  user_role: string;
  mode: string;
}

const props: Readonly<Props> = defineProps<Props>();
const user: StoreGeneric = useUserStore();
const containerId = "game-container";
const game = await import("@/game/gameConfig");

onMounted(() => {
  gameInfo.setInfo(user.id, props.room_name, props.user_role, props.mode);
  game.launch(containerId);
});

defineExpose(
  defineComponent({
    name: "GamePlay",
  })
);
</script>

<style scoped>
.game-frame {
  height: 70vh;
  width: 70vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
