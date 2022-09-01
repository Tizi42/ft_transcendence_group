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
import { Ref, ref, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
const profile: Ref<any> = ref("");
const router = useRouter();
onBeforeMount(async () => {
  await fetch("http://localhost:3000/api/private", {
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
