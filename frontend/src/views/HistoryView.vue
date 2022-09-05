<template>
  <div class="page" v-if="logged">
    <div class="title">
      <div class="titleName">
        <img src="@/assets/icons/clock.svg" />
        <h1>Match history</h1>
      </div>
      <button class="reload" @click="reloadData()"></button>
    </div>
    <div class="content">
      <TableHistory :ready="dataReady" :battles="battles" title="Global" />
      <TableHistory :ready="dataReady" :battles="battles" title="Personal" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import "@/assets/styles/historyAndLeaderboard.css";
import { defineComponent, defineExpose, ref } from "vue";
import { onBeforeMount, onUpdated } from "vue";
import { useRouter } from "vue-router";
import TableHistory from "../components/TableHistory.vue";

const dataReady = ref(false);
const battles = ref({});
const router = useRouter();
const logged = ref(false);

// setTimeout to test loading -> to remove
async function reloadData() {
  console.log("reloading...");
  await setTimeout(async () => {
    let response = await fetch("http://localhost:3000/api/battles", {
      credentials: "include",
    });
    battles.value = await response.json();
    dataReady.value = true;
  }, 1000);
  console.log("ok");
}

onBeforeMount(async () => {
  await reloadData();
  console.log(battles.value);
  console.log(dataReady.value);
  console.log("mounted");
});

defineExpose(
  defineComponent({
    name: "HistoryView",
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
