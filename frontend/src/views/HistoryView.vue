<template>
  <div class="page">
    <div class="title">
      <div class="titleName">
        <img src="@/assets/icons/clock.svg" />
        <h1>Match history</h1>
      </div>
      <button class="reload" @click="reloadData()"></button>
    </div>
    <div class="content">
      <TableHistory
        title="Global"
        :ready="dataReady"
        :battles="battlesGlobal"
      />
      <TableHistory
        title="Personal"
        :ready="dataReady"
        :battles="battlesPersonal"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import "@/assets/styles/historyAndLeaderboard.css";
import { defineComponent, defineExpose, ref } from "vue";
import { onBeforeMount } from "vue";
import { getUrlOf } from "@/router";
import TableHistory from "@/components/MatchHistory/TableHistory.vue";

const dataReady = ref(false);
const battlesGlobal = ref({});
const battlesPersonal = ref({});

// setTimeout to test loading -> to remove
async function reloadData() {
  await setTimeout(async () => {
    let response = await fetch(getUrlOf("api/battles"), {
      credentials: "include",
    });
    battlesGlobal.value = await response.json();
    battlesPersonal.value = battlesGlobal.value; // to change
    dataReady.value = true;
  }, 1000);
}

onBeforeMount(async () => {
  await reloadData();
});

defineExpose(
  defineComponent({
    name: "HistoryView",
  })
);
</script>
