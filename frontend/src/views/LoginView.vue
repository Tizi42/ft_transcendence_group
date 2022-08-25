<template>
  <div class="container">
    <img id="ping-pong" src="@/assets/pingPongIcon.png" />
    <button
      v-if="!loggedIn()"
      class="btn"
      data="Sign in with 42"
      @click="handleLogin()"
    ></button>
    <button v-else class="btn" data="Logout" @click="handleLogout()"></button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "LoginView",
});
</script>

<script setup lang="ts">
function loggedIn() {
  if (getCookie("jwt") === "") {
    return false;
  } else {
    return true;
  }
}

function getCookie(cname: string) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function handleLogin() {
  window.location.href = "http://localhost:3000/api/auth/42/login";
}

function handleLogout() {
  document.cookie = "jwt" + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  window.location.reload();
}
</script>

<style>
body {
  background-color: #1e2a02;
}

#ping-pong {
  height: 200px;
}

.container {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

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
