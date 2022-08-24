<template>
  <div class="login">
    <img id="ping-pong" src="@/assets/pingPongIcon.png" />
    <button>Sign in with 42</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "LoginView",
});
</script>

<script setup lang="ts">
import { onMounted } from "vue";

onMounted(() => {
  // window.location.href = "http://localhost:3000/api/auth/42/login";
});
</script>

<style>
body {
  background-color: #1e2a02;
}

.login {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 800px;
}

#ping-pong {
  height: 200px;
}

button {
  box-sizing: border-box;
  padding: 19px 43px;
  gap: 10px;
  border-radius: 22px;
  border: 5px solid;
  /* border-image: linear-gradient(
    254.5deg,
    rgba(0, 95, 62, 1) -18.41%,
    rgba(255, 218, 0, 1) 66.67%
  ); */
  font-size: 24px;
  font-weight: bold;
}
</style>
