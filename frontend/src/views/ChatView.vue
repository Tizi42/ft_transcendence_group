<template>
  <div class="about">
    <h1>This is the CHAT page</h1>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount } from "vue";
import { useRouter } from "vue-router";

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
      console.log(user);
    })
    .catch((error) => {
      console.log(error);
    });
});
</script>
