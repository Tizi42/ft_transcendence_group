<template>
  <div class="page">
    <div class="title">
      <div class="titleName">
        <img src="@/assets/icons/leaderboard.svg" />
        <h1>Leaderboard</h1>
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

<style scoped>
.titleName {
  display: flex;
  flex-direction: row;
}

@keyframes rotation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}

.reload {
  filter: brightness(0) saturate(100%) invert(22%) sepia(74%) saturate(1495%)
    hue-rotate(134deg) brightness(92%) contrast(101%);
  margin-right: 20px;
  background-color: #00000000;
  background-image: url("../assets/icons/refresh.svg");
  background-repeat: no-repeat;
  background-size: 42px 42px;
  width: 42px;
  height: 42px;
  border: none;
  fill: none;
}

.reload:hover {
  animation: rotation 2s infinite linear;
  cursor: pointer;
}
</style>
