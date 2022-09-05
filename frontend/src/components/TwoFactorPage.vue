<template>
  <GenerateTwoFactorVue v-if="profile.isFirstEnablingTwoFactor" />
  <TurnOnTwoFactorVue v-if="!isTwoFactorAuthentication" />
  <AuthenticateTwoFactorVue v-else />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import GenerateTwoFactorVue from "./TwoFactorComponents/GenerateTwoFactor.vue";
import TurnOnTwoFactorVue from "./TwoFactorComponents/TurnOnTwoFactor.vue";
import AuthenticateTwoFactorVue from "./TwoFactorComponents/AuthenticateTwoFactor.vue";

export default defineComponent({
  name: "TwoFactorPage",
  components: {
    GenerateTwoFactorVue,
    TurnOnTwoFactorVue,
    AuthenticateTwoFactorVue,
  },
});
</script>

<script lang="ts" setup>
import { onBeforeMount, ref, Ref } from "vue";

const profile: Ref<any> = ref("");
const isTwoFactorAuthentication: Ref<boolean> = ref(false);

onBeforeMount(async () => {
  await fetch("http://localhost:3000/api/private", {
    credentials: "include",
  })
    .then((response) => {
      if (response.status !== 200) {
        isTwoFactorAuthentication.value = true;
      }
      return response.json();
    })
    .then((user) => {
      profile.value = user;
    })
    .catch((error) => {
      console.log(error);
    });
});
</script>

<style>
h3,
h4 {
  color: white;
}

p {
  text-align: center;
  color: red;
}
</style>
