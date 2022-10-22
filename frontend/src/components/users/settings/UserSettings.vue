<template>
  <div class="wrapper-settings">
    <div class="settings">
      <div class="setting-navbar">
        <div
          class="setting-navbar-item"
          :class="{ active: selected === 'AccountOptions' }"
          @click="select('AccountOptions')"
        >
          Account
        </div>
        <div
          class="setting-navbar-item"
          :class="{ active: selected === 'BlockedUsers' }"
          @click="select('BlockedUsers')"
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
import AccountOptions from "./AccountOptions.vue";
import BlockedUsers from "./BlockedUsers.vue";
import { useRouter } from "vue-router";
import { useCookie } from "vue-cookie-next";
import socket from "@/socket";
import { useCookies } from "vue3-cookies";

// const { isCookieAvailable } = useCookie();
const { cookies } = useCookies();

const router = useRouter();
let selected = ref("AccountOptions");

let menu = {
  AccountOptions,
  BlockedUsers,
};

function select(toSelect: string) {
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
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
}

.settings {
  display: flex;
  position: relative;
  width: 100%;
  gap: 50px;
}

.setting-navbar {
  margin-left: 8%;
  align-items: left;
  width: 14%;
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
  overflow-y: scroll;
  overflow-x: hidden;
  scrollbar-width: 0px;
  background-color: var(--dark-green-background);
  text-align: left;
  display: flex;
  flex-direction: column;
}

.setting-field::-webkit-scrollbar {
  display: none;
}
</style>
