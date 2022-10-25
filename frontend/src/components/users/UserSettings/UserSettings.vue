<template>
  <div class="wrapper-settings">
    <div class="settings">
      <div class="setting-navbar">
        <div
          class="setting-navbar-item"
          :class="{ active: selected === 0 }"
          @click="select(0)"
        >
          Account
        </div>
        <div
          class="setting-navbar-item"
          :class="{ active: selected === 1 }"
          @click="select(1)"
        >
          Blocked Users
        </div>
        <button id="logout-button" @click="toLogout">LOG OUT</button>
      </div>
      <div class="setting-field">
        <Transition name="slide-top">
          <component :is="menu[selected]"></component>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, defineExpose, ref } from "vue";
import { Component as ComponentVue } from "vue";
import AccountOptions from "./AccountOptions.vue";
import BlockedUsers from "./BlockedUsers.vue";
import { useRouter } from "vue-router";
import socket from "@/socket";
import { useCookies } from "vue3-cookies";

// const { isCookieAvailable } = useCookie();
const { cookies } = useCookies();

const router = useRouter();
let selected = ref(0);

let menu: Array<ComponentVue> = [AccountOptions, BlockedUsers];

function select(toSelect: number) {
  selected.value = toSelect;
}

async function toLogout() {
  if (cookies.get("jwt")) {
    socket.emit("logout_all");
  }
}

socket.on("force_logout", () => {
  console.log("cookie jwt = ", cookies.get("jwt"));
  cookies.remove("jwt");
  router.push({
    name: "login",
  });
});

defineExpose(
  defineComponent({
    name: "UserSetting",
  })
);
</script>

<style scoped>
.wrapper-settings {
  display: flex;
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
}

.settings {
  display: flex;
  position: relative;
  justify-content: center;
  height: 100%;
  width: 80%;
  left: 10%;
  gap: 50px;
}

.setting-navbar {
  align-items: left;
  width: 14%;
  min-width: 190px;
  text-align: left;
  display: flex;
  flex-direction: column;
  height: fit-content;
}

.setting-navbar-item {
  font-family: "Outfit";
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  line-height: 1.2;
  color: #ffffff;
  background-color: var(--dark-green-background);
  border-radius: 12px;
  padding: 18px;
  margin-bottom: 10px;
  transition: all 0.5s ease;
}

.setting-navbar-item:hover {
  cursor: pointer;
  transform: scale(1.1);
}

.setting-navbar-item.active {
  background: linear-gradient(135deg, #1e2b02 0%, #ffcb00 150%);
  color: var(--main-color);
}

#logout-button {
  border: 3px solid var(--main-red);
  border-radius: 22px;
  color: var(--main-red);
  font-family: "Outfit";
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 25px;
  padding: 0.2em 1.2em 0.2em 1.2em;
  background-color: transparent;
  width: fit-content;
  margin: auto;
  margin-top: 1em;
  transition: all 0.5s ease;
}

#logout-button:hover {
  cursor: pointer;
  transform: scale(1.05, 1.05);
}

.setting-field {
  scrollbar-width: 0px;
  text-align: left;
  display: flex;
  flex-direction: column;
  background: none;
  width: 100%;
  height: 100%;
}

.setting-field::-webkit-scrollbar {
  display: none;
}
</style>
