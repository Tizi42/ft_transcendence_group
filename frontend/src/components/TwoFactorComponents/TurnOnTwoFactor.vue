<template>
  <div class="container-turn-on">
    <h4>
      Enter your 2FA code below to turn on<br />two-factor authentication :
    </h4>
    <form @submit.prevent="verifyCode" id="form">
      <input
        v-model="authenticationCode"
        placeholder="Code (ex: 123456)"
        type="text"
      />
      <input type="submit" value="Submit" />
    </form>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, defineExpose, ref, Ref } from "vue";
import router from "@/router";
import { getUrlOf } from "@/router";

const authenticationCode: Ref<string> = ref("");

const verifyCode = async () => {
  await fetch(getUrlOf("api/auth/2fa/turn-on"), {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      authenticationCode: authenticationCode.value,
    }),
  })
    .then((response: Response) => {
      let p1 = document.querySelector("p");
      p1?.remove();
      if (response.status === 200) {
        router.push({
          name: "settings",
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
    .then((data) => {
      console.log("success : ", data);
    })
    .catch((error: Error) => {
      console.log("error : ", error);
    });
};

defineExpose(
  defineComponent({
    name: "TurnOnTwoFactor",
  })
);
</script>
