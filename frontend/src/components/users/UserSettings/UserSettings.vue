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
    </div>
    <div class="setting-field">
      <component :is="menu[selected]"></component>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, defineExpose, ref } from "vue";
import AccountOptions from "./AccountOptions.vue";
import BlockedUsers from "./BlockedUsers.vue";

let selected = ref("AccountOptions");

let menu = {
  AccountOptions,
  BlockedUsers,
};

function select(toSelect: string) {
  selected.value = toSelect;
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

.setting-field {
  flex: 1;
  margin-right: 7%;
  height: 545px;
  overflow: scroll;
  background-color: rgba(20, 29, 1, 1);
  text-align: left;
  display: flex;
  flex-direction: column;
}

.option-group {
  border-top: 1px solid rgba(147, 150, 148, 1);
  margin: 36px 15% 48px 5%;
  padding-right: 2%;
}

.on-off-option {
  display: flex;
}

.on-off {
  align-self: flex-end;
  margin-left: auto;
  object-fit: cover;
  height: 20px;
}

.option {
  font-family: "Outfit";
  font-style: normal;
  font-weight: 500;
  font-size: 22px;
  color: rgba(255, 255, 255, 1);
  margin: 20px 3% 0px 3%;
}

.option:hover {
  cursor: pointer;
}
</style>
