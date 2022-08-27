<template>
  <div class="container">
    <h1 class="p-3 text-center">Battle history</h1>
    <table class="table table-striped table-bordered">
      <thead>
        <tr>
          <th>Date</th>
          <th>Opponent1</th>
          <th>Opponent2</th>
          <th>Winner</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="battle in battles" :key="battle.id">
          <td>{{ battle.date_start }}</td>
          <td>{{ battle.opponent1 }}</td>
          <td>{{ battle.opponent2 }}</td>
          <td>{{ battle.winner }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { Ref, ref, onBeforeMount } from "vue";
import { useRouter } from "vue-router";

const battles: Ref<any> = ref("");
const router = useRouter();

onBeforeMount(async () => {
  await fetch("http://localhost:3000/api/battles", {
    credentials: "include",
  })
    .then((response) => {
      if (response.status != 200) {
        router.push({
          name: "login",
        });
        return response.json();
      }
      return response.json();
    })
    .then((response) => {
      battles.value = response;
    })
    .catch((error) => {
      console.log(error);
    });
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
