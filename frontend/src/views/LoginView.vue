<template>
  <div class="container">
    <div class="boxLogin">
      <img id="ping-pong" src="@/assets/icons/pingPongIcon.png" />
      <LoginPage />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import LoginPage from "@/components/LoginPage.vue";

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
  margin-bottom: 20px;
}

.container {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.boxLogin {
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: space-around;
  flex-direction: column;
  gap: 30px;
  padding: 7em 7em;
  background: #1e2a02ff;
  box-shadow: 0px 0px 8px #000000bf;
  border-radius: 58px;
  position: absolute;
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
}
</style>
