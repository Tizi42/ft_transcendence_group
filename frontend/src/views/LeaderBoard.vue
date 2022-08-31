<template>
  <div class="container">
    <h1 class="p-3 text-center">Leaderboard</h1>
    <h1 class="p-3 text-center">Battle history</h1>
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
          <td>{{ battle.opponent1 }} ></td>
          <td>{{ battle.opponent2 }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

let battles = {};
let dataReady = false;

function reloadData() {
  battles = fetch("http://localhost:3000/api/battles/test", {
    credentials: "include",
  });
  dataReady = true;
}

// lifecycle hooks
onMounted(() => {
  reloadData();
  console.log("yo");
});
</script>

<style>
h1 {
  color: white;
}

table {
  color: white;
  width: 50%;
}
</style>
