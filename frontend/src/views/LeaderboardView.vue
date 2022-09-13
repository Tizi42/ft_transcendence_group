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
        :ready="dataReadyPersonal"
        :leaderboard="leaderboardGlobal"
        :reorder="reloadAndOrderGlobal"
      />
      <LeaderBoard
        title="Friends"
        :ready="dataReadyGlobal"
        :leaderboard="leaderboardPersonal"
        :reorder="reloadAndOrderPersonal"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import "@/assets/styles/historyAndLeaderboard.css";
import { defineComponent, defineExpose, ref } from "vue";
import { onBeforeMount } from "vue";
import LeaderBoard from "@/components/Leaderboard/Leaderboard.vue";

const dataReadyGlobal = ref(false);
const dataReadyPersonal = ref(false);
const leaderboardGlobal = ref({});
const leaderboardPersonal = ref({});

// setTimeout to delay loading -> to remove
async function reloadAll() {
  setTimeout(async () => {
    let response = await fetch("http://localhost:3000/api/users", {
      credentials: "include",
    });
    leaderboardGlobal.value = await response.json();
    leaderboardPersonal.value = leaderboardGlobal.value; // to change
    dataReadyGlobal.value = true;
    dataReadyPersonal.value = true;
  }, 1000);
}

async function reloadAndOrderGlobal(order: number) {
  console.log("new order for global:", order);
  setTimeout(async () => {
    let response = await fetch("http://localhost:3000/api/users", {
      credentials: "include",
    });
    leaderboardGlobal.value = await response.json();
    dataReadyGlobal.value = true;
  }, 1000);
}

async function reloadAndOrderPersonal(order: number) {
  console.log("new order for personal:", order);
  setTimeout(async () => {
    let response = await fetch("http://localhost:3000/api/users", {
      credentials: "include",
    });
    leaderboardPersonal.value = await response.json();
    dataReadyPersonal.value = true;
  }, 1000);
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
