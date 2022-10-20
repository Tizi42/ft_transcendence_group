<template>
  <div class="notifContainer" v-if="pendingReq">
    <div class="notifContent">
      {{ inviteId }} wants to fight with you
      <button @click="accept()">Accept</button>
      <button @click="refuse()">Decline</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from "@/stores/user";
import { onBeforeMount, Ref, ref } from "vue";
import { Invitation } from "@backend/game/utils/invitation";
import socket from "@/socket";
import { StoreGeneric } from "pinia";
import router from "@/router";

const pendingReq: Ref<boolean> = ref(false);
const inviteId: Ref<number> = ref(-1);
const user: StoreGeneric = useUserStore();

function accept() {
  socket.emit("accept_invitation", {
    sender: inviteId.value,
    user_id: user.id,
  });
}

function refuse() {
  socket.emit("refuse_invitation", {
    sender: inviteId.value,
    user_id: user.id,
  });
}

onBeforeMount(() => {
  socket.on("game_invitation", (data: Invitation) => {
    pendingReq.value = true;
    inviteId.value = data.sender_id;
  });
  socket.on("invitation_expired", () => {
    pendingReq.value = false;
  });
  socket.on("go_play", (roomName: string) => {
    pendingReq.value = false;
    router.push({ name: "pong", params: { room_name: roomName } });
  });
});
</script>

<style scoped>
.notifContainer {
  z-index: 999;
  position: fixed;
  top: 0%;
  left: 0%;
  width: 100vw;
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.notifContent {
  display: flex;
  align-items: center;
  width: 60vw;
  height: 50px;
  min-width: 600px;
  padding-left: 1em;
  padding-right: 1em;
  background: #000000aa;
  color: #bebebe;
  border-radius: 22px;
  box-shadow: 0px 2px 4px #bebebe22;
}
</style>
