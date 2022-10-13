<template>
  <div id="user-page">
    <div class="main-wrapper" ref="toScrollTop">
      <ProfileBanner />
      <div class="user-navbar">
        <router-link to="/user/stats">
          <div class="user-navbar-item">STATS</div>
        </router-link>
        <router-link to="/user/friends" @click="removeNotification()">
          <div class="user-navbar-item">FRIENDS</div>
        </router-link>
        <router-link to="/user/settings">
          <div class="user-navbar-item">SETTINGS</div>
        </router-link>
      </div>
      <div class="wrapper">
        <RouterView v-slot="{ Component }">
          <Transition name="slide-top">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, defineExpose, ref, Ref } from "vue";
import { onBeforeMount } from "vue";
import ProfileBanner from "@/components/users/ProfileBanner.vue";
import socket from "@/socket";
import { onBeforeRouteLeave, onBeforeRouteUpdate } from "vue-router";

const toScrollTop: Ref<HTMLElement | undefined> = ref();

defineExpose(
  defineComponent({
    name: "UserView",
  })
);

function scrollTop() {
  console.log(toScrollTop);
  if (toScrollTop.value != undefined) toScrollTop.value.scrollTop = 0;
}

function removeNotification() {
  socket.emit("remove_notification");
}

onBeforeRouteUpdate(() => {
  scrollTop();
});

onBeforeRouteLeave(() => {
  scrollTop();
});

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
  padding: 0px 0px;
  display: flex;
  flex-direction: row;
  padding: 0;
  border-bottom: 1px solid #93969480;
  margin-bottom: 30px;
}

.user-navbar a {
  text-decoration: none;
}

.user-navbar a:hover .user-navbar-item {
  color: var(--main-color);
}

.user-navbar a.router-link-active .user-navbar-item {
  color: var(--main-color);
  border-bottom: 3px solid var(--main-color);
}

.user-navbar-item {
  font-family: "Outfit";
  font-style: normal;
  font-weight: 600;
  font-size: 26px;
  line-height: 1.6;
  margin: 0px 28px 6px;
  color: #ffffff;
  text-align: center;
}

.main-wrapper {
  position: fixed;
  top: 0vh;
  left: 10vw;
  height: 95vh;
  width: 80vw;
  background: var(--dark-green-background-transparent);
  border-bottom-left-radius: 22px;
  border-bottom-right-radius: 22px;
  box-shadow: var(--main-shadow);
  overflow: auto;
  scroll-behavior: smooth;
}

#user-page {
  height: 100vh;
  width: 100vw;
}

.wrapper {
  position: relative;
}
</style>
