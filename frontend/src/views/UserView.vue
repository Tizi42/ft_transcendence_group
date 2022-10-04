<template>
  <div id="user-page">
    <ProfileBanner />
    <div class="user-navbar">
      <router-link to="/user/stats">
        <div class="user-navbar-item">STATS</div>
      </router-link>
      <router-link to="/user/friends">
        <div class="user-navbar-item">FRIENDS</div>
      </router-link>
      <router-link to="/user/settings">
        <div class="user-navbar-item">SETTINGS</div>
      </router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, onBeforeMount } from "vue";
import ProfileBanner from "./../components/users/ProfileBanner.vue";
import socket from "./../socket.ts";

defineExpose(
  defineComponent({
    name: "UserView",
  })
);

onBeforeMount(() => {
  socket.on("new_connection", () => {
    console.log("on user page");
  });
});
</script>

<style scoped>
.user-navbar {
  width: 86%;
  margin-left: 7%;
  margin-right: 7%;
  margin-top: 20px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: row;
  padding: 0;
  border-bottom: 1px solid rgba(147, 150, 148, 0.5);
}

.user-navbar a {
  text-decoration: none;
}

.user-navbar a:hover .user-navbar-item {
  color: rgba(255, 203, 0, 1);
}

.user-navbar a.router-link-active .user-navbar-item {
  color: rgba(255, 203, 0, 1);
  border-bottom: 3px solid rgba(255, 203, 0, 1);
}

.user-navbar-item {
  font-family: "Outfit";
  font-style: normal;
  font-weight: 600;
  font-size: 26px;
  line-height: 1.6;
  margin: 0px 28px 6px;
  color: rgba(255, 255, 255, 1);
  text-align: center;
}
</style>
