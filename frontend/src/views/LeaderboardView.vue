<template>
  <div class="page">
    <div class="title">
      <div class="titleName">
        <img src="@/assets/icons/leaderboard.svg" />
        <h1>Leaderboard</h1>
      </div>
      <button class="reload" @click="reloadAll()"></button>
    </div>
    <div class="content">
      <LeaderBoard
        title="Global"
        :ready="dataReady[0]"
        :leaderboard="leaderboard[0]"
        :reorder="reloadAndOrder(0)"
      />
      <LeaderBoard
        title="Friends"
        :ready="dataReady[1]"
        :leaderboard="leaderboard[1]"
        :reorder="reloadAndOrder(1)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import "@/assets/styles/historyAndLeaderboard.css";
import { defineComponent, defineExpose, ref } from "vue";
import { onBeforeMount } from "vue";
import { getUrlOf } from "@/router";
import LeaderBoard from "@/components/Leaderboard/Leaderboard.vue";

const dataReady = ref([false, false]);
const leaderboard = ref([{}, {}]);
const orders = ref([1, 1]);

async function reloadOne(index: number) {
  let response = await fetch(
    getUrlOf("api/users/leaderboard/" + orders.value[index].toString()),
    {
      credentials: "include",
    }
  );
  leaderboard.value[index] = await response.json();
  dataReady.value[index] = true;
}

async function reloadAll() {
  reloadOne(0);
  reloadOne(1);
}

function reloadAndOrder(index: number) {
  return async function reloadAndOrderFunc(order: number) {
    orders.value[index] = order;
    reloadOne(index);
  };
}

onBeforeMount(async () => {
  await reloadAll();
});

defineExpose(
  defineComponent({
    name: "LeaderboardView",
  })
);
</script>
