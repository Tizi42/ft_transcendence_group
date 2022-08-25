<template>
  <div class="about">
    <h1>Hey {{ profile.username }}</h1>
    <ul>
      <li><span>Id : </span>{{ profile.id }}</li>
      <li><span>Email : </span>{{ profile.email }}</li>
      <li><span>Display Name : </span>{{ profile.displayName }}</li>
      <li>
        <span>Picture profile : </span>
        <img :src="profile.picture" width="100" />
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, Ref, ref } from "vue";

const profile: Ref<any> = ref("");

onMounted(async () => {
  await fetch("http://localhost:3000/api/private", {
    credentials: "include",
  })
    .then((response) => {
      return response.json();
    })
    .then((user) => {
      profile.value = user;
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

li {
  list-style: none;
  color: white;
}
</style>
