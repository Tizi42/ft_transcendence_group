<template>
  <div class="pageCenter">
    <div class="overlayBox" v-if="dataReady">
      <OverlayTopBar
        v-if="opponent != null"
        :playerL="createUserMinimal(playerL)"
        :playerR="createUserMinimal(playerR)"
        :scores="scores"
        :messageL="messageL"
        :messageR="messageR"
        :emojisURL="emojisURL"
        :emojiL="emojiL"
        :emojiR="emojiR"
        :emojiDateL="emojiDateL"
        :emojiDateR="emojiDateR"
      />
      <GameBox :room_name="room_name" :user_role="user_role" :mode="mode" />
      <OverlayBottomBar
        :user="createUserFromStore(user)"
        :role="user_role"
        :room_name="room_name"
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
import { defineComponent, defineExpose, onBeforeMount, defineProps } from "vue";
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
import { onBeforeRouteLeave } from "vue-router";
import router from "@/router/index";
import { StoreGeneric } from "pinia";

interface Props {
  room_name: string;
  playerL_id: number;
  playerR_id: number;
  mode: string;
}

const user: StoreGeneric = useUserStore();
const opponent: UserMinimal = new UserMinimal();
const props: Readonly<Props> = defineProps<Props>();
const playerL: Ref<User | null> = ref(null);
const playerR: Ref<User | null> = ref(null);
const messageL: Ref<Chat | null> = ref(null);
const messageR: Ref<Chat | null> = ref(null);
const emojiL: Ref<number> = ref(3);
const emojiR: Ref<number> = ref(0);
const emojiDateL: Ref<Date> = ref(new Date());
const emojiDateR: Ref<Date> = ref(new Date());
const dataReady: Ref<boolean> = ref(false);
const readyStatus: Ref<Array<boolean>> = ref([false, false]);
const scores: Ref<Array<number>> = ref([0, 0]);
const emojisURL: Array<URL> = [];
const force_quit = ref(false);
const user_role = ref("");

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

function createUserMinimal(user: User | null): UserMinimal {
  let newUser = new UserMinimal();
  if (user == null) return newUser;
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

async function getPlayersInfo() {
  console.log(props);
  dataReady.value = false;

  let left: Response = await fetch(
    getUrlOf("api/users/info/" + props.playerL_id),
    {
      credentials: "include",
    }
  );
  playerL.value = await left.json();

  let right: Response = await fetch(
    getUrlOf("api/users/info/" + props.playerR_id),
    {
      credentials: "include",
    }
  );
  playerR.value = await right.json();

  setTimeout(() => {
    dataReady.value = true;
  }, 500);
}

function changeSound(value: number) {
  console.log("user wants to change sound", value);
}

function quitGame() {
  force_quit.value = false;
  router.push({ name: "play" });
}

function changeBackground() {
  console.log("user wants to change background");
}

onBeforeRouteLeave((to: any, from: any) => {
  if (force_quit.value) return true;
  const answer = window.confirm(
    "Do you really want to leave? You will quit the game room"
  );
  if (!answer) return false;
  socket.emit("leave_game", {
    room_name: props.room_name,
    user_id: user.id,
  });
});

onBeforeMount(async () => {
  console.log("on before mount in game overlay...");
  await getPlayersInfo();
  loadEmojis();
  socket.on("receive_message_ingame", async (data: any) => {
    updateMessage(data);
  });
  socket.on("receive_emoji_ingame", async (data: any) => {
    updateEmoji(data);
  });

  if (user.id === props.playerL_id) user_role.value = "left";
  else if (user.id === props.playerR_id) user_role.value = "right";
  else user_role.value = "watch";

  socket.on("score_update", (data: any) => {
    console.log("score:", data);
    scores.value[0] = data.left;
    scores.value[1] = data.right;
  });

  socket.on("quit_game", () => {
    window.alert("Player has left game, return to game menu...");
    force_quit.value = true;
    router.push({ name: "play" });
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
  position: absolute;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background: var(--main-gradient-background);
}
</style>
