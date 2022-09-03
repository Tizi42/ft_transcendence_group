<template>
  <div class="page">
    <div class="title">
      <img src="@/assets/icons/clock.svg" />
      <h1>Match history</h1>
    </div>
    <div class="content">
      <TableHistory :ready="dataReady" title="Global" />
      <TableHistory :ready="dataReady" title="Personal" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, defineExpose, ref } from "vue";
import { onBeforeMount } from "vue";
//import { useRouter } from "vue-router";
import TableHistory from "../components/TableHistory.vue";

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
  }, 4000);
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
body {
  overflow: scroll;
}

.title {
  display: flex;
  align-item: left;
  margin-top: 3em;
  margin-bottom: 3em;
}

.title img {
  height: 42px;
  margin-right: 10px;
}

.title h1 {
  color: var(--main-color);
  font-family: "Outfit SemiBold";
  font-size: 40px;
  margin: 0;
}

.page {
  background: linear-gradient(
    116.6deg,
    #005f3e -20.9%,
    #feca00 99.99%,
    #ffda00 100%
  );
  height: 100vh;
  width: 100vw;
  padding-left: 15vw;
  padding-top: 1em;
  display: flex;
  justify-content: left;
  align-items: left;
  text-align: left;
  flex-direction: column;
}

.content {
  width: 70vw;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-direction: column;
}

table {
  color: white;
  width: 50%;
}
</style>
