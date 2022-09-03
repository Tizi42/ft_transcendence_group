<template>
  <div class="setting-navbar">
    <div class="setting-navbar-item">Account</div>
    <div class="setting-navbar-item">Privacy</div>
    <div class="setting-navbar-item">Bloacked Users</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "UserSetting",
});
</script>

<style scoped>
.setting-navbar {
  margin-left: 7%;
  align-items: left;
  width: 16%;
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
  padding: 10px;
}
</style>
