<template>
  <div>
    <TransitionGroup name="list" tag="ul">
      <li v-for="(player, id) in items" :key="id">
        <PlayerResult
          v-if="show"
          :player="player"
          :pos="id + 1"
          :pp="player.picture"
          :alone="alone"
        />
      </li>
    </TransitionGroup>
  </div>
</template>

<script lang="ts" setup>
//  imports
import { defineComponent, defineExpose, defineProps } from "vue";
import { onMounted, onUpdated } from "vue";
import { ref, Ref } from "vue";
import PlayerResult from "./PlayerResult.vue";
import { User } from "@backend/users/users.entity";

//  variables
interface Props {
  leaderboard: Array<User>;
  alone: boolean;
}

const props: Readonly<Props> = defineProps<Props>();
const items: Ref<Array<User>> = ref([]);
const show: Ref<boolean> = ref(false);

//  usefull functions
async function reshowData() {
  show.value = false;
  items.value = [];
  for await (const [key, item] of props.leaderboard.entries()) {
    setTimeout(() => {
      items.value.push(item);
    }, 200 * (key + 1));
  }
  show.value = true;
}

//  lifecycle hook
onMounted(async () => {
  await reshowData();
});

onUpdated(async () => {
  await reshowData();
});

//  expose component
defineExpose(
  defineComponent({
    name: "ContentLeaderboard",
  })
);
</script>
