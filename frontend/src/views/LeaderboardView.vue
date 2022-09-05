<template>
  <div class="page">
    <div class="title">
      <img src="@/assets/icons/leaderboard.svg" />
      <h1>Leaderboard</h1>
    </div>
    <div class="title">
      <div class="titleName">
        <img src="@/assets/icons/leaderboard.svg" />
        <h1>Match history</h1>
      </div>
      <button class="reload" @click="reloadData()"></button>
    </div>
    <div class="content">
      <LeaderBoard :ready="dataReady" title="Global" />
      <LeaderBoard :ready="dataReady" title="Friends" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import "@/assets/styles/historyAndLeaderboard.css";
import { defineComponent, defineExpose, ref } from "vue";
import { onBeforeMount } from "vue";
import LeaderBoard from "../components/Leaderboard.vue";

const dataReady = ref(false);
const battles = ref({});

// setTimeout to test loading -> to remove
async function reloadData() {
  setTimeout(async () => {
    console.log("reloading");
    let response = await fetch("http://localhost:3000/api/battles", {
      credentials: "include",
    });
    battles.value = await response.json();
    dataReady.value = true;
    console.log("reload end");
  }, 1000);
}

onBeforeMount(async () => {
  await reloadData();
  console.log(battles.value);
  console.log(dataReady.value);
  console.log("mounted");
});

defineExpose(
  defineComponent({
    name: "LeaderboardView",
  })
);
</script>
