<template>
  <div v-if="!isTwoFactorAuthentication" class="container-re-generate">
    <button v-if="!firstEnablingTwoFactor" @click="generateNewQrCode">
      Generate a new QrCode
    </button>
  </div>
  <GenerateTwoFactorVue v-if="firstEnablingTwoFactor" />
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
import { getUrlOf } from "@/router";
import { User } from "@backend/users/users.entity";

const profile: Ref<User | null> = ref(null);
const isTwoFactorAuthentication: Ref<boolean> = ref(false);
const firstEnablingTwoFactor: Ref<boolean> = ref(false);

function generateNewQrCode() {
  if (firstEnablingTwoFactor.value === false) {
    firstEnablingTwoFactor.value = true;
    fetch(getUrlOf("api/auth/2fa/reGenerate"), {
      credentials: "include",
    })
      .then((response: Response) => {
        return response.status;
      })
      .then((status) => {
        console.log(status);
      })
      .catch((error: Error) => {
        console.log("ERROR : ", error);
      });
  }
}

onBeforeMount(async () => {
  await fetch(getUrlOf("api/private"), {
    credentials: "include",
  })
    .then((response: Response) => {
      let p1 = document.querySelector("p");
      p1?.remove();
      if (response.status !== 200) {
        isTwoFactorAuthentication.value = true;
      }
      return response.json();
    })
    .then((user: User) => {
      profile.value = user;
      firstEnablingTwoFactor.value = user.isFirstEnablingTwoFactor;
    })
    .catch((error: Error) => {
      console.log("ERROR : ", error);
    });
});
</script>
