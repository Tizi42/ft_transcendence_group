<template>
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
      <component :is="menu[selected]"></component>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, ref } from "vue";
import AccountOptions from "./AccountOptions.vue";
import BlockedUsers from "./BlockedUsers.vue";
import { useRouter } from "vue-router";
import { useCookie } from "vue-cookie-next";

const { isCookieAvailable } = useCookie();

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
  if (isCookieAvailable("jwt")) {
    await fetch("http://localhost:3000/api/logout", {
      credentials: "include",
    })
      .then((response) => {
        router.push({
          name: "login",
        });
        return response.json();
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

defineExpose(
  defineComponent({
    name: "UserSetting",
  })
);
</script>

<style scoped>
.settings {
  display: flex;
  margin-bottom: 25px;
}
.setting-navbar {
  margin-left: 7%;
  margin-right: 1%;
  align-items: left;
  width: 14em;
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
  color: rgba(255, 255, 255, 1);
  background-color: rgba(20, 29, 1, 1);
  padding: 18px;
}

.setting-navbar-item:hover {
  cursor: pointer;
}

.setting-navbar-item.active {
  background: linear-gradient(90deg, #141d01 0%, #ffcb00 145.91%);
}

#logout-button {
  border: 5px solid rgba(212, 57, 29, 1);
  border-radius: 22px;
  color: rgba(212, 57, 29, 1);
  font-family: "Outfit";
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 25px;
  padding: 0.2em 1.2em 0.2em 1.2em;
  background-color: transparent;
  width: fit-content;
  margin: auto;
  margin-top: 2em;
}

#logout-button:hover {
  cursor: pointer;
  transform: scale(1.05, 1.05);
}

.setting-field {
  flex: 1;
  margin-right: 7%;
  height: fit-content;
  max-height: 535px;
  overflow: scroll;
  background-color: rgba(20, 29, 1, 1);
  text-align: left;
  display: flex;
  flex-direction: column;
}
</style>
