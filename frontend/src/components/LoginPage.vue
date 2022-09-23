<template>
  <button class="btn" data="Sign in with 42" @click="handleLogin()"></button>
  <router-link :to="{ name: 'dev-login' }" class="btn" id="link">
    Log in with email
  </router-link>
</template>

<script setup lang="ts">
import { defineComponent, onBeforeMount, defineExpose } from "vue";
import { useRouter } from "vue-router";
import { getUrlOf } from "@/router";

const router = useRouter();

function handleLogin() {
  window.location.href = getUrlOf("api/auth/42/login");
}

onBeforeMount(async () => {
  await fetch(getUrlOf("api/private"), {
    credentials: "include",
  })
    .then((response) => {
      if (response.status === 200) {
        router.push({
          name: "game",
        });
      }
      return response.json();
    })
    .catch((error) => {
      console.log("ERROR : ", error);
    });
});

defineExpose(
  defineComponent({
    name: "LoginPage",
  })
);
</script>

<style>
.btn {
  padding: 19px 43px;
  border: none;
  outline: none;
  position: relative;
  border-radius: 22px;
  background: linear-gradient(
    254.5deg,
    rgba(0, 95, 62, 1) -18.41%,
    rgba(255, 218, 0, 1) 66.67%
  );
  cursor: pointer;
  margin-top: 20px;
  z-index: 1;
}

#link {
  text-decoration: none;
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  color: rgba(255, 218, 0, 1);
}

.btn::before {
  content: "";
  position: absolute;
  top: 4px;
  right: 4px;
  bottom: 4px;
  left: 4px;
  background-color: #1e2a02;
  border-radius: 18px;
  z-index: -1;
  transition: 200ms;
}

.btn::after {
  content: attr(data);
  /* font-family: "Outfit"; */
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 30px;
  background: linear-gradient(180deg, #005f3e 0%, #ffda00 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.btn:hover::before {
  opacity: 20%;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.btn:hover::after {
  color: #1e2a02;
}
</style>
