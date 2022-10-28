<template>
  <button class="btn" data="Sign in with 42" @click="handleLogin()"></button>
  <router-link :to="{ name: 'dev-login' }" id="link">
    <button class="btn" data="Log in with email"></button>
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
  }).then((response: Response) => {
    if (response.status === 200) {
      router.push({
        name: "game",
      });
    }
    return response.json();
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
  padding: 19px 0px;
  width: 300px;
  border: none;
  outline: none;
  position: relative;
  border-radius: 22px;
  background: var(--main-revgradient-background);
  cursor: pointer;
  z-index: 1;
}

#link {
  text-decoration: none;
  font-style: normal;
  font-weight: bold;
  color: #005f3e;
  font-size: 24px;
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
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 30px;
  background: linear-gradient(180deg, #005f3e 0%, #ffcb00 100%);
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
