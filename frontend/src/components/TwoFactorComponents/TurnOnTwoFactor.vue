<template>
  <div class="container-turn-on">
    <h4>Enter your 2FA code below :</h4>
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

<style scoped>
h4 {
  color: #ffffff;
  font-family: "Outfit Light";
  font-size: 20px;
}

input[type="submit"] {
  display: block;
  font-family: "Outfit Bold";
  background: #1e2a02;
  box-shadow: 0px 0px 4px 3px rgba(0, 0, 0, 0.25);
  border-radius: 22px;
  line-height: 2.3em;
  border: none;
  font-size: 24px;
  color: #ffffff;
  width: 40%;
  margin-top: 1.5em;
}

input[type="text"] {
  display: block;
  font-family: "Outfit";
  text-align: center;
  background: rgba(30, 42, 2, 0.7);
  box-shadow: inset 0px 0px 4px 3px rgba(0, 0, 0, 0.25);
  border-radius: 22px;
  border: none;
  font-size: 1em;
  line-height: 3.5em;
  width: 70%;
  color: #ffffff;
}

input[type="text"]:focus {
  outline: none;
}

::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

#form {
  width: 30vw;
  display: flex;
  flex-direction: column;
  display: space-between;
  align-items: center;
}

.container-turn-on {
  display: flex;
  align-items: center;
  flex-direction: column;
}
</style>
