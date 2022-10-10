<template>
  <div class="pageCenter">
    <div class="overlayBox" v-if="dataReady">
      <OverlayTopBar
        v-if="opponent != null"
        :user="createUserFromStore(user)"
        :opponent="opponent"
        :time="timer"
        :scores="scores"
        :messageL="messageL"
        :messageR="messageR"
        :emojisURL="emojisURL"
        :emojiL="emojiL"
        :emojiR="emojiR"
        :emojiDateL="emojiDateL"
        :emojiDateR="emojiDateR"
      />
      <GameBox />
      <OverlayBottomBar
        :user="createUserFromStore(user)"
        :opponent="opponentId"
        :emojisURL="emojisURL"
        @changeSound="changeSound"
        @quitGame="quitGame"
        @changeBackground="changeBackground"
      />
      <ReadyButton v-if="readyStatus[0]" />
      <ReadyButton v-if="readyStatus[1]" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, defineExpose, onBeforeMount } from "vue";
import { Ref, ref } from "vue";
import OverlayTopBar from "./OverlayTopBar.vue";
import OverlayBottomBar from "./OverlayBottomBar.vue";
import GameBox from "./GameBox.vue";
import ReadyButton from "./ReadyButton.vue";
import { useUserStore } from "@/stores/user";
import { Chat } from "@backend/chat/entities/chat.entity";
import { UserMinimal } from "@/components/utils/UserMinimal";
import { User } from "@backend/users/users.entity";
import { getUrlOf } from "@/router";
import socket from "@/socket";
import { StoreGeneric } from "pinia";

const user: StoreGeneric = useUserStore();
const opponent: UserMinimal = new UserMinimal();
const opponentId = user.id == 4 ? 11 : 4;
const messageL: Ref<Chat | null> = ref(null);
const messageR: Ref<Chat | null> = ref(null);
const emojiL: Ref<number> = ref(3);
const emojiR: Ref<number> = ref(0);
const emojiDateL: Ref<Date> = ref(new Date());
const emojiDateR: Ref<Date> = ref(new Date());
const dataReady: Ref<boolean> = ref(false);
const readyStatus: Ref<Array<boolean>> = ref([false, false]);
const timer: Ref<Date> = ref(new Date());
const scores: Array<number> = [0, 0];
const emojisURL: Array<URL> = [];

type emojiInfo = {
  author: string;
  dest: string;
  content: number;
};

function createUserFromStore(user: StoreGeneric): UserMinimal {
  let newUser = new UserMinimal();
  newUser.id = user.id;
  newUser.displayName = user.displayName;
  return newUser;
}

function loadEmojis() {
  for (var i = 1; i < 38; i++) {
    emojisURL.push(
      new URL("../../assets/icons/emojis/" + i + ".svg", import.meta.url)
    );
  }
}

function updateMessage(msg: Chat) {
  if (msg.author == user.id) messageL.value = msg;
  else messageR.value = msg;
}

function updateEmoji(msg: emojiInfo) {
  if (msg.author == user.id.toString()) {
    emojiL.value = msg.content;
    emojiDateL.value = new Date();
  } else {
    emojiR.value = msg.content;
    emojiDateR.value = new Date();
  }
}

async function getOpponent(index: number) {
  dataReady.value = false;
  let response: Response = await fetch(getUrlOf("api/users/info/" + index), {
    credentials: "include",
  });
  let responseUser: User = await response.json();
  opponent.id = responseUser.id;
  opponent.displayName = responseUser.displayName;
  setTimeout(() => {
    dataReady.value = true;
  }, 500);
}

function changeSound(value: number) {
  console.log("user wants to change sound", value);
}

function quitGame() {
  console.log("user wants to leave game");
}

function changeBackground() {
  console.log("user wants to change background");
}

onBeforeMount(async () => {
  await getOpponent(opponentId);
  loadEmojis();
  timer.value = new Date();
  socket.on("receive_message_ingame", async (data) => {
    updateMessage(data);
  });
  socket.on("receive_emoji_ingame", async (data) => {
    updateEmoji(data);
  });
});

defineExpose(
  defineComponent({
    name: "GameOverlay",
  })
);
</script>

<style scoped>
.overlayBox {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  position: absolute;
  width: 80%;
  height: 90%;
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  cursor: default;
  background: rgba(30, 42, 2, 0.8);
  color: #ffffff;
  font-family: "Outfit";
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.75);
  border-radius: 58px;
}

.pageCenter {
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  background: var(--main-gradient-background);
}
</style>
