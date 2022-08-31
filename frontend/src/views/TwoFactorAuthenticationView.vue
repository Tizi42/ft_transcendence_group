<template>
  <img
    src="https://www.seekpng.com/png/full/332-3324043_the-google-authenticator-code-is-incorrect-or-has.png"
    alt="google authenticator logo"
    width="200"
  />
  <TwoFactor />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TwoFactor from "@/components/TwoFactor.vue";

export default defineComponent({
  name: "TwoFactorAuthenticationView",
  components: {
    TwoFactor,
  },
});
</script>
