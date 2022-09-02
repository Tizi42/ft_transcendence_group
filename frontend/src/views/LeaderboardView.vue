<template>
  <div class="page">
    <div class="title">
      <img src="@/assets/icon-leaderboard-stroke.png" />
      <h1>Leaderboard</h1>
    </div>
    <div class="content">
      <LeaderBoard v-if="dataReady" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import "@/assets/styles/historyAndLeaderboard.css";
import { defineComponent, defineExpose, ref } from "vue";
import { onBeforeMount } from "vue";
//import { useRouter } from "vue-router";
import LeaderBoard from "../components/Leaderboard.vue";

const dataReady = ref(false);
const battles = ref({});
//const router = useRouter();

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
  }, 2000);
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
