<template>
  <div class="page2FA">
    <div class="box">
      <img
        src="@/assets/icons/googleAuthticator.svg"
        alt="google authenticator logo"
        class="GAlogo"
      />
      <div class="title">Google Authenticator</div>
      <TwoFactorPage />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, defineExpose } from "vue";
import TwoFactorPage from "@/components/TwoFactorPage.vue";

defineExpose(
  defineComponent({
    name: "TwoFactorView",
  })
);
</script>

<style scoped>
.page2FA {
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  background: var(--main-gradient-background);
}

.page2FA img {
  width: 4vw;
}

.page2FA .title {
  color: var(--main-color);
  font-family: "Outfit Bold";
  font-size: 2em;
  color: #cccccc;
  display: block;
  padding: 0;
  margin: 0;
}

.box {
  margin-top: 30vh;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: space-evenly;
  flex-direction: column;
  padding-top: 2em;
  padding-bottom: 2em;
  width: 35vw;
  height: 25vw;
  background: rgba(30, 42, 2, 0.8);
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.75);
  border-radius: 58px;
}
</style>
