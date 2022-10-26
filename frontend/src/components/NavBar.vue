<template>
  <div class="nav-container">
    <nav id="navbar">
      <div class="barTag">
        <img src="@/assets/icons/barTag.svg" alt="icon Bar Tag" />
      </div>
      <router-link :to="{ name: 'game' }">
        <div class="link-container">
          <img src="@/assets/icons/pingpong.svg" alt="icon PingPong" />
        </div>
      </router-link>
      <router-link :to="{ name: 'chat' }">
        <div class="link-container">
          <img src="@/assets/icons/chat.svg" alt="icon Chat" />
          <img
            src="@/assets/icons/circle.svg"
            class="notify"
            v-if="pendingMsg"
          />
        </div>
      </router-link>
      <router-link :to="{ name: 'user' }">
        <div class="link-container">
          <img src="@/assets/icons/profile.svg" alt="icon User" />
          <img
            src="@/assets/icons/circle.svg"
            class="notify"
            v-if="pendingReq"
          />
        </div>
      </router-link>
    </nav>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from "@/stores/user";
import { onBeforeMount, onBeforeUnmount, Ref, ref } from "vue";
import socket from "@/socket";

const user = useUserStore();
const pendingReq: Ref<boolean> = ref(false);
const pendingMsg: Ref<boolean> = ref(false);
user.doFetch();

onBeforeMount(async () => {
  user.doFetchPending();
  if (user.pending.length > 0) pendingReq.value = true;
  socket.on("receive_friendship", async () => {
    pendingReq.value = true;
  });
  socket.on("ignore_notification", async () => {
    pendingReq.value = false;
  });
  socket.on("receive_message_notification", () => {
    pendingMsg.value = true;
  });
  socket.on("receive_channel_notification", (id: number) => {
    if (id != user.id) pendingMsg.value = true;
  });
  socket.on("ignore_chat_notification", async () => {
    pendingMsg.value = false;
  });
});

onBeforeUnmount(() => {
  socket.off("receive_friendship");
  socket.off("ignore_notification");
  socket.off("receive_message_notification");
  socket.off("receive_channel_notification");
  socket.off("ignore_chat_notification");
});
</script>

<style scoped>
.wrapper {
  z-index: 1;
  position: fixed;
  top: 0%;
  width: 100vw;
  height: 100vh;
  left: 0%;
  background: var(--main-gradient-background);
}

.notify {
  display: block;
  position: absolute;
  right: 15px;
  top: 65px;
  height: 25px;
  width: 25px;
}
</style>
