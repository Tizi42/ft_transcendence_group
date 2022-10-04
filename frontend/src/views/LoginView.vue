<template>
  <div class="container">
    <img id="ping-pong" src="./../assets/icons/pingPongIcon.png" />
    <LoginPage />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import LoginPage from "./../components/LoginPage.vue";

export default defineComponent({
  name: "LoginView",
  components: {
    LoginPage,
  },
});
</script>

<style>
#ping-pong {
  height: 200px;
}

.container {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
