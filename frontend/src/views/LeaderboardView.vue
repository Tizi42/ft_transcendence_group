<template>
  <div class="container">
    <h1 class="title">Leaderboard</h1>
    <LeaderBoard />
  </div>
</template>

<script lang="ts" setup>
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

<style scoped>
.title {
  font-family: "Outfit Bold";
  font-size: 40px;
  line-height: 50px;
  color: var(--main-color);
}

.container {
  background: linear-gradient(
    116.6deg,
    #005f3e -20.9%,
    #feca00 99.99%,
    #ffda00 100%
  );
}
</style>
