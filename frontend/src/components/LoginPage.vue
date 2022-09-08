<template>
  <button
    v-if="!loggedIn"
    class="btn"
    data="Sign in with 42"
    @click="handleLogin()"
  ></button>
  <button v-else class="btn" data="Logout" @click="handleLogout()"></button>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref, Ref } from "vue";
import { useCookie } from "vue-cookie-next";
import { getUrlOf } from "@/router";

export default defineComponent({
  name: "LoginPage",
});
</script>

<script setup lang="ts">
const { isCookieAvailable } = useCookie();
const loggedIn: Ref<boolean> = ref(false);

function handleLogin() {
  window.location.href = getUrlOf("api/auth/42/login");
}

async function handleLogout() {
  if (isCookieAvailable("jwt")) {
    await fetch(getUrlOf("api/logout"), {
      credentials: "include",
    })
      .then((response) => {
        return response.json();
      })
      .catch((error) => {
        console.log(error);
      });
  }
  window.location.reload();
}

onBeforeMount(async () => {
  await fetch(getUrlOf("api/private"), {
    credentials: "include",
  })
    .then((response) => {
      if (response.status === 200) {
        loggedIn.value = true;
      }
      return response.json();
    })
    .catch((error) => {
      console.log("ERROR : ", error);
    });
});
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
