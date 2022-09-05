<template>
  <div class="container-turn-on">
    <h4>Verify the code here for turn-on 2FA :</h4>
    <form @submit.prevent="verifyCode" id="form">
      <input v-model="authenticationCode" />
      <input type="submit" />
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from "vue";

export default defineComponent({
  name: "TurnOnTwoFactor",
});
</script>

<script lang="ts" setup>
import router from "@/router";

const authenticationCode: Ref<string> = ref("");

const verifyCode = async () => {
  await fetch("http://localhost:3000/api/auth/2fa/turn-on", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      authenticationCode: authenticationCode.value,
    }),
  })
    .then((response) => {
      let p1 = document.querySelector("p");
      p1?.remove();
      if (response.status === 200) {
        router.push({
          name: "user",
        });
      } else {
        authenticationCode.value = "";
        let newP = document.createElement("p");
        newP.textContent = "Wrong code !";
        document.body.append(newP);
      }
      return response.json();
    })
    .then((data) => {
      console.log("success : ", data);
    })
    .catch((error) => {
      console.log("error : ", error);
    });
};
</script>
