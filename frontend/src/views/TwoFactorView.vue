<template>
  <div class="page2FA">
    <div class="box">
      <a
        href="https://support.google.com/accounts/answer/1066447?hl=en&co=GENIE.Platform%3DAndroid&oco=0"
        tabindex="-1"
      >
        <img
          src="@/assets/icons/googleAuthticator.svg"
          alt="google authenticator logo"
          class="GAlogo"
        />
      </a>
      <div class="titleGA">Google Authenticator</div>
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
