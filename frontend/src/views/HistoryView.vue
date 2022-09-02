<template>
  <div class="container">
    <h1 class="p-3">Battle history</h1>
    <TableHistory v-if="dataReady" />
    <table v-if="dataReady" class="table table-striped table-bordered">
      <thead>
        <tr>
          <th>Date</th>
          <th>Time</th>
          <th>Opponent1</th>
          <th>Opponent2</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="battle in battles" :key="battle.id">
          <td>{{ battle.date }}</td>
          <td>{{ battle.time }}</td>
          <td>{{ battle.opponent1 }}</td>
          <td>{{ battle.opponent2 }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script lang="ts" setup>
import { defineComponent, defineExpose, ref } from "vue";
import { onBeforeMount, onMounted, onUpdated } from "vue";
import { useRouter } from "vue-router";
import TableHistory from "../components/TableHistory.vue";

const dataReady = ref(false);
const battles = ref({});
const router = useRouter();

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
    name: "HistoryView",
  })
);
</script>

<style>
.container {
  background: linear-gradient(
    116.6deg,
    #005f3e -20.9%,
    #feca00 99.99%,
    #ffda00 100%
  );
}
h1 {
  color: white;
}

table {
  color: white;
  width: 50%;
}
</style>
