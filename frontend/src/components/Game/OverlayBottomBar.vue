<template>
  <div class="overlayBottomBar">
    <FloatingMenu
      direction="row"
      height="300px"
      width="300px"
      background="#0c1200ee"
      right="0px"
      left=""
      padding="0px 20px"
      ref="menuRef"
      :canClick="props.role != 'watch'"
    >
      <template #button>
        <div class="settingsBtn emoji" />
      </template>
      <template #choices>
        <div
          v-for="(url, index) in emojisURL"
          :key="index"
          class="emoji-choice"
        >
          <img :src="url.toString()" @click="sendEmoji(index + 1)" />
        </div>
      </template>
    </FloatingMenu>
    <SmallChat
      :user="user"
      :room_name="room_name"
      :role="props.role"
      :canTalk="showWatchersChat"
      @getChatting="changeChattingStatus"
      ref="chatRef"
    />
    <FloatingMenu
      direction="row"
      width="200px"
      height="60px"
      background="#0c1200fa"
      right="0px"
    >
      <template #button>
        <button class="settingsBtn sound" />
      </template>
      <template #choices>
        <img
          src="../../assets/icons/soundOff_grey.svg"
          class="soundIcon"
          @click="emit('changeSound', 0)"
        />
        <img
          src="../../assets/icons/sound_grey.svg"
          class="soundIcon"
          @click="emit('changeSound', -1)"
        />
        <img
          src="../../assets/icons/soundUp.svg"
          class="soundIcon"
          @click="emit('changeSound', 1)"
        />
      </template>
    </FloatingMenu>
    <FloatingMenu
      direction="column"
      width="500px"
      height="350px"
      background="#0c1200fa"
      left="0px"
    >
      <template #button>
        <button class="settingsBtn help" />
      </template>
      <template #choices>
        <div class="rulesTxt">
          Use
          <img src="../../assets/icons/upArrow.svg" class="inlineImg" />
          and
          <img src="../../assets/icons/downArrow.svg" class="inlineImg" />
          to move your paddle.<br /><br />
          Points are earned when one fails to<br />
          return the ball to the other.<br /><br />
          You need 11 points to win.<br /><br />
          GL HF!
        </div>
      </template>
    </FloatingMenu>
    <FloatingMenu
      direction="column"
      width="250px"
      height="100px"
      background="#0c1200fa"
      left="0px"
    >
      <template #button>
        <button class="settingsBtn settings" />
      </template>
      <template #choices>
        <div class="setting-choice" @click="toogleChatW()">
          {{ showWatchersChat ? "Hide" : "Show" }} viewers chat
        </div>
        <div class="setting-choice red" @click="emit('quitGame')">
          Quit game
        </div>
      </template>
    </FloatingMenu>
    <WatchersChat :message="message" v-if="showWatchersChat" />
  </div>
</template>

<script lang="ts" setup>
import {
  defineComponent,
  defineExpose,
  ref,
  Ref,
  defineProps,
  defineEmits,
  onBeforeUnmount,
  onBeforeMount,
} from "vue";
import { UserMinimal } from "@/components/utils/UserMinimal";
import { messageInGame } from "@backend/chat/utils/types";
import FloatingMenu from "../utils/FloatingMenu.vue";
import SmallChat from "./SmallChat.vue";
import socket from "@/socket";
import WatchersChat from "./WatchersChat.vue";

interface Props {
  user: UserMinimal;
  role: string;
  room_name: string;
  message: messageInGame | null;
  emojisURL: Array<URL>;
}

const props: Readonly<Props> = defineProps<Props>();
const isChatting: Ref<boolean> = ref(false);
const showWatchersChat: Ref<boolean> = ref(true);
const chatRef = ref();
const menuRef = ref();
const emit = defineEmits(["quitGame", "changeSound"]);
const opacity = props.role == "watch" ? 0.2 : 1;
const scale = props.role == "watch" ? "" : "scale(1.15)";
const pointer = props.role == "default" ? "" : "pointer";

function changeChattingStatus(event: boolean) {
  isChatting.value = event;
}

function sendEmoji(id: number) {
  const data = {
    content: id,
    author: props.user.id,
    dest: props.room_name,
  };
  socket.emit("send_emoji_ingame", data);
}

function handleKeys(event: KeyboardEvent) {
  if (event.key == "Enter") {
    if (isChatting.value) {
      if (chatRef.value) chatRef.value.methods.sendMsg();
    } else {
      document.getElementById("inputChat")?.focus();
      isChatting.value = true;
    }
  }
  if (event.key == "Escape") {
    if (isChatting.value) {
      document.getElementById("inputChat")?.blur();
    } else {
      menuRef.value.methods.closeMenu();
    }
  }
  if (event.key == "t" && !isChatting.value) {
    menuRef.value.methods.toggleMenu();
  }
}

onBeforeMount(() => {
  window.addEventListener("keyup", handleKeys);
});

onBeforeUnmount(() => {
  window.removeEventListener("keyup", handleKeys);
});

function toogleChatW() {
  showWatchersChat.value = !showWatchersChat.value;
}

defineExpose(
  defineComponent({
    name: "OverlayBottomBar",
  })
);
</script>

<style scoped>
.overlayBottomBar {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  width: 70%;
  height: 10%;
  gap: 15px;
}

.settingsBtn {
  width: 50px;
  min-width: 50px;
  height: 50px;
  min-height: 50px;
  background: #1e2b02cc;
  border: 2px solid var(--main-color);
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 12px;
  transition: all 0.2s ease-out;
  background-position: center;
  background-size: 37px 37px;
  background-repeat: no-repeat;
  opacity: 1;
}

.settingsBtn:hover {
  transform: scale(1.15);
  cursor: pointer;
}

.emoji {
  opacity: v-bind(opacity);
}

.emoji:hover {
  transform: v-bind(scale);
  cursor: v-bind(pointer);
}

.emoji {
  background-image: url("@/assets/icons/emoji.svg");
}

.sound {
  background-image: url("@/assets/icons/sound.svg");
}

.help {
  background-image: url("@/assets/icons/question.svg");
}

.settings {
  background-image: url("@/assets/icons/settings.svg");
}

.inlineImg {
  height: 1.5em;
  display: inline-block;
  position: relative;
  top: 7px;
  padding-right: 5px;
  padding-left: 5px;
}

.setting-choice {
  line-height: 2em;
  font-size: 1.2em;
  transition: all 0.3s ease;
}

.setting-choice:hover {
  cursor: pointer;
  transform: scale(1.1);
}

.red {
  color: var(--main-red);
}

.rulesTxt {
  line-height: 1.5em;
  font-size: 1.2em;
}

.emoji-choice {
  width: 20%;
  min-width: 20%;
  min-height: 25%;
  display: flex;
  align-items: left;
  justify-content: center;
}

.emoji-choice img {
  display: block;
  background-position: center;
  background-repeat: no-repeat;
  transition: all 0.5s ease;
  width: 80%;
}

.emoji-choice img:hover {
  cursor: pointer;
  transform: scale(1.2);
}

.soundIcon {
  width: 40px;
  height: 40px;
  transition: all 0.3s ease;
}

.soundIcon:hover {
  cursor: pointer;
  transform: scale(1.2);
}
</style>
