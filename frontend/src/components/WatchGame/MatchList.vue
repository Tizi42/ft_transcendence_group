<template>
  <div class="groupMatch">
    <TransitionGroup name="fadeGroup">
      <div v-for="room in items" :key="items.indexOf(room)">
        <MatchItem
          :room="room"
          :modeIcon="modeIcons[getModeIndex(room.mode)]"
        />
      </div>
    </TransitionGroup>
  </div>
</template>

<script lang="ts" setup>
import { GameRoomNS } from "@backend/game/utils/gameNS";
import { defineComponent, defineExpose, defineProps } from "vue";
import { onMounted, onUpdated } from "vue";
import { Ref, ref } from "vue";
import MatchItem from "./MatchItem.vue";
interface Props {
  rooms: Array<GameRoomNS>;
}

const modeIcons: Array<URL> = [
  new URL("../../assets/icons/gameMode/modeNormal.svg", import.meta.url),
  new URL("../../assets/icons/gameMode/modeMagic.svg", import.meta.url),
  new URL("../../assets/icons/gameMode/modeSpeed.svg", import.meta.url),
];

const props: Readonly<Props> = defineProps<Props>();
const items: Ref<Array<GameRoomNS>> = ref([]);

function getModeIndex(mode: string): number {
  if (mode == "normal") return 0;
  else if (mode == "magic") return 1;
  return 2;
}

async function reshowData() {
  items.value = [];
  for await (const [key, item] of props.rooms.entries()) {
    setTimeout(() => {
      items.value.push(item);
    }, 500 * (key + 1));
  }
}

onMounted(async () => {
  await reshowData();
});

onUpdated(async () => {
  await reshowData();
});

defineExpose(
  defineComponent({
    name: "MatchList",
  })
);
</script>

<style scoped>
.groupMatch {
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: flex-start;
  gap: 12px;
  overflow: auto;
  width: 100%;
}
</style>
