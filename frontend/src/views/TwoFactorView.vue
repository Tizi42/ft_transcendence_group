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
  margin-bottom: 2vw;
}

.page2FA .title {
  color: var(--main-color);
  font-family: "Outfit Bold";
  font-size: 2em;
  color: #cccccc;
  display: block;
  padding: 0;
  margin: 0;
  margin-bottom: 1vw;
}

.box {
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: space-evenly;
  flex-direction: column;
  padding-top: 2em;
  padding-bottom: 2em;
  width: 35vw;
  background: rgba(30, 42, 2, 0.8);
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.75);
  border-radius: 58px;
  position: absolute;
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
}
</style>
