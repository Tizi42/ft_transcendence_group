<template>
  <div v-if="profile.isFirstEnablingTwoFactor" class="container-generate">
    <h3>Scan this Qr Code to get the 6 numbers verification code</h3>
    <img id="QrCode" src="" />
  </div>
  <div v-if="!profile.isTwoFactorAuthenticationEnabled">
    <h4>Verify the code here for turn-on 2FA :</h4>
    <form @submit.prevent="verifyCode" id="form">
      <input v-model="authenticationCode" />
      <input type="submit" />
    </form>
  </div>
  <div v-if="profile.isTwoFactorAuthenticationEnabled">
    <h4>Verify the code here for authenticate with 2FA :</h4>
    <form @submit.prevent="authenticate" id="form">
      <input v-model="authenticationCode" />
      <input type="submit" />
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "TwoFactor",
});
</script>

<script lang="ts" setup>
import router from "@/router";
import { onBeforeMount, ref, Ref } from "vue";

const authenticationCode: Ref<string> = ref("");
const profile: Ref<any> = ref("");

const authenticate = async () => {
  await fetch("http://localhost:3000/api/auth/2fa/authenticate", {
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
        document.body.append(newP);
      }
      return response.json();
    })
    .then((data) => {
      console.log("success : ", data);
    })
    .then((error) => {
      console.log("error : ", error);
    });
};

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

onBeforeMount(async () => {
  await fetch("http://localhost:3000/api/private", {
    credentials: "include",
  })
    .then((response) => {
      return response.json();
    })
    .then((user) => {
      profile.value = user;
    })
    .catch((error) => {
      console.log(error);
    });
  if (
    profile.value.isTwoFactorAuthenticationEnabled === false &&
    profile.value.isFirstEnablingTwoFactor === true
  ) {
    await fetch("http://localhost:3000/api/auth/2fa/generate", {
      method: "POST",
      credentials: "include",
    })
      .then((response) => {
        return response.blob();
      })
      .then((blob: any) => {
        const myImage: any = document.getElementById("QrCode");
        const imageUrl = URL.createObjectURL(blob);
        myImage.src = imageUrl;
      })
      .catch((error) => {
        console.log(error);
      });
  }
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
