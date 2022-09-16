<template>
  <div class="tableContent">
    <TransitionGroup name="list" tag="ul">
      <li v-for="(player, id) in items" :key="id">
        <PlayerResult
          v-if="show"
          :player="player"
          :pos="id + 1"
          :pp="getPictureUrl(player.id)"
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

//  variables
const props = defineProps(["leaderboard"]);
const items = ref([]);
const show = ref(false);

function getPictureUrl(id: number): string {
  return (
    "http://localhost:3000/api/users/avatar/" +
    id.toString() +
    "?_=" +
    `${+new Date()}`
  );
}

const images = ref([]);

function preload(ids: Ref<[]>) {
  for (var i = 0; i < ids.length; i++) {
    images.value[i] = new Image();
    images.value[i].src =
      "http://localhost:3000/api/users/avatar/" + ids[i].toString();
  }
}

async function preloadPic() {
  const ids = ref([]);
  for await (const [user] of props.leaderboard.entries()) {
    ids.value.push(user.id);
  }
  preload(ids.value);
}

//  usefull functions
async function reshowData() {
  await preloadPic();
  for await (const [key, item] of props.leaderboard.entries()) {
    setTimeout(() => {
      items.value.push(item);
    }, 500 * (key + 1));
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
