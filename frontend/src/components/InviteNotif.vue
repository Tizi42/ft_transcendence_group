<template>
  <Transition name="slide-top">
    <div class="notifContainer" v-if="pendingReq && sender != null">
      <div class="notifContent">
        <div class="notifTxt">
          <img :src="sender.picture" class="notifPP" />
          <div class="notifTxtWrap">
            <div class="senderName">{{ sender.displayName }}</div>
            wants to play with you!
            <div class="notifMode">({{ mode }} mode)</div>
          </div>
        </div>
        <div class="notifBtn">
          <button @click="accept()" class="acceptBtn">Accept</button>
          <button @click="refuse()" class="declineBtn">Decline</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
import { useUserStore } from "@/stores/user";
import { onBeforeMount, onBeforeUnmount, Ref, ref } from "vue";
import { Invitation } from "@backend/game/utils/invitation";
import socket from "@/socket";
import { StoreGeneric } from "pinia";
import router, { getUrlOf } from "@/router";
import { User } from "@backend/users/users.entity";

const pendingReq: Ref<boolean> = ref(false);
const inviteId: Ref<number> = ref(-1);
const mode: Ref<string> = ref("");
const user: StoreGeneric = useUserStore();
const sender: Ref<User | null> = ref(null);

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

async function getSenderInfo(id: number) {
  let rspInfo: Response = await fetch(getUrlOf("api/users/info/" + id), {
    credentials: "include",
  });
  sender.value = await rspInfo.json();
}

onBeforeMount(() => {
  socket.on("game_invitation", async (data: Invitation) => {
    inviteId.value = data.sender_id;
    mode.value = data.mode;
    await getSenderInfo(data.sender_id);
    pendingReq.value = true;
  });
  socket.on("invitation_expired", () => {
    pendingReq.value = false;
  });
  socket.on("go_play", (roomName: string) => {
    console.log(roomName);
    pendingReq.value = false;
    router.push({ name: "pong", params: { room_name: roomName } });
  });
});

onBeforeUnmount(() => {
  socket.off("game_invitation");
  socket.off("invitation_expired");
  socket.off("go_play");
});
</script>

<style scoped>
@media screen and (max-width: 1050px) {
  .notifMode {
    display: none;
  }
}

.notifContainer {
  z-index: 999;
  position: fixed;
  top: 0%;
  left: 0%;
  width: 100vw;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.notifContent {
  display: flex;
  align-items: center;
  width: 60vw;
  height: 60px;
  min-width: 530px;
  padding-left: 1em;
  padding-right: 1em;
  background: #000000aa;
  color: #bebebe;
  border-radius: 22px;
  box-shadow: 0px 2px 4px #bebebe22;
  justify-content: space-between;
}

.notifPP {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 100%;
  margin-right: 5px;
}

.notifTxt {
  display: flex;
  align-items: center;
  justify-content: left;
  gap: 5px;
  width: 100%;
}
.notifTxtWrap {
  display: flex;
  align-items: center;
  justify-content: left;
  gap: 5px;
  width: 100%;
  flex-wrap: wrap;
}

.senderName {
  font-family: "Outfit Bold";
}

.notifBtn {
  display: flex;
  justify-content: right;
  align-items: center;
  gap: 10px;
}

.notifBtn button {
  font-family: "Outfit";
  border-radius: 20px;
  padding: 5px 20px 5px 20px;
  border: none;
  color: #ffffff;
  transition: all 0.3s ease;
}

.notifBtn button:hover {
  transform: scale(1.05);
  cursor: pointer;
}

.acceptBtn {
  background-color: #009c34;
}

.declineBtn {
  background-color: #d4391d;
}

.notifMode {
  margin-left: 5px;
  font-size: 14px;
}
</style>
