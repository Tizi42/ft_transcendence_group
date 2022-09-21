<template>
  <div class="container-auth">
    <h4>Enter your 2FA code below<br />to authenticate :</h4>
    <form @submit.prevent="authenticate" id="form">
      <input
        v-model="authenticationCode"
        placeholder="Code (ex: 123456)"
        type="text"
      />
      <input type="submit" value="Submit" />
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from "vue";
import "@/assets/styles/authentication.css";
import { getUrlOf } from "@/router";

export default defineComponent({
  name: "AuthenticateTwoFactor",
});
</script>

<script lang="ts" setup>
import router from "@/router";

const authenticationCode: Ref<string> = ref("");

const authenticate = async () => {
  await fetch(getUrlOf("api/auth/2fa/authenticate"), {
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
          name: "game",
        });
      } else {
        authenticationCode.value = "";
        let newP = document.createElement("p");
        newP.textContent = "Wrong code !";
        let form = document.getElementById("form");
        form?.append(newP);
      }
      return response.json();
    })
    .catch((error) => {
      console.log("error : ", error);
    });
};
</script>
