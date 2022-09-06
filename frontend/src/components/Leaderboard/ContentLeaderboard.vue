<template>
  <div class="tableContent">
    <TransitionGroup name="list" tag="ul">
      <li v-for="(player, id) in items" :key="id">
        <PlayerResult v-if="show" :player="player" :pos="id + 1" />
      </li>
    </TransitionGroup>
  </div>
</template>

<script lang="ts" setup>
//  imports
import { defineComponent, defineExpose, defineProps } from "vue";
import { onMounted, onUpdated } from "vue";
import { ref } from "vue";
import PlayerResult from "./PlayerResult.vue";

//  variables
const props = defineProps(["leaderboard"]);
const items = ref([]);
const show = ref(false);

//  usefull functions
async function reshowData() {
  for await (const [key, item] of props.leaderboard.entries()) {
    setTimeout(() => {
      items.value.push(item);
    }, 200 * (key + 1));
  }
}

//  lifecycle hook
onMounted(async () => {
  show.value = false;
  await reshowData();
  show.value = true;
});

onUpdated(async () => {
  show.value = false;
  items.value = [];
  await reshowData();
  show.value = true;
});

//  expose component
defineExpose(
  defineComponent({
    name: "ContentLeaderboard",
  })
);
</script>
