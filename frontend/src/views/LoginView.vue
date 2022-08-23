<template>
  <div class="login">
    <h1>This is the LOGIN page</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from "vue";

export default defineComponent({
  name: "LoginView",
});
</script>

<script setup lang="ts">
import { onMounted } from "vue";
import axios from "axios";

onMounted(() => {
  axios
    .get("http://localhost:3000/api/auth/42/login")
    .then((response: { data: any }) => {
      console.log("reponse : ", response.data);
    })
    .catch((error: any) => {
      console.log(error);
    });
});
</script>
