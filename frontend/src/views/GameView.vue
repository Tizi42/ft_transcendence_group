<template>
  <div class="home">
    <img alt="logo" src="../assets/pingPongIcon.png" />
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, defineExpose } from "vue";
import { onBeforeMount } from "vue";
import { useRouter } from "vue-router";

defineExpose(
  defineComponent({
    name: "GameView",
  })
);

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
