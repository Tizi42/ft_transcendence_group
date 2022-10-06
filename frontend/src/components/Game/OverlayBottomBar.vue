<template>    
  <div class="overlayBottomBar">
    <FloatingMenu
      direction="row"
      height="30vh"
      width="400px"
      background="#00000077"
      right="0px"
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
          <img
            :src="url.toString()"
            @click="sendEmoji(index + 1)"
          />
        </div>
      </template>
    </FloatingMenu>
    <SmallChat
      :user="user"
      :opponent="opponent"
      @getChatting="changeChattingStatus"
      ref="chatRef"
    />
    <FloatingMenu
      direction="column"
      width="200px"
      height=""
      background="#000000aa"
      left="0px"
    >
      <template #button>
        <button class="settingsBtn sound" />
      </template>
      <template #choices>
        <div class="setting-choice">Sound off</div>
        <div class="setting-choice">Quit game</div>
      </template>
    </FloatingMenu>
    <FloatingMenu
      direction="column"
      width="200px"
      height=""
      background="#000000aa"
      left="0px"
    >
      <template #button>
        <button class="settingsBtn help" />
      </template>
      <template #choices>
        <div class="setting-choice">Rules are ....</div>
      </template>
    </FloatingMenu>
    <FloatingMenu
      direction="column"
      width="200px"
      height=""
      background="#000000aa"
      left="0px"
    >
      <template #button>
        <button class="settingsBtn settings" />
      </template>
      <template #choices>
        <div class="setting-choice">Sound off</div>
        <div class="setting-choice">Quit game</div>
      </template>
    </FloatingMenu>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, defineExpose, onMounted, ref, Ref } from "vue";
import { defineProps } from "vue";
import { userInfoStore } from "@/stores/user";
import FloatingMenu from "../utils/FloatingMenu.vue";
import SmallChat from "./SmallChat.vue";
import socket from "@/socket";

interface Props {
  user: userInfoStore;
  opponent: number;
  emojisURL: Array<URL>;
}

const props: Readonly<Props> = defineProps<Props>();
const emojiArray: Array<string> = [];
const isChatting: Ref<boolean> = ref(false);
const chatRef = ref();
const menuRef = ref();

function changeChattingStatus(event: boolean) {
  isChatting.value = event;
}

function sendEmoji(id: number) {
  const data = {
    content: id,
    author: props.user.id,
    dest: props.opponent,
  };
  console.log("sending emoji", id);
  socket.emit("send_emoji_ingame", data);
}

onMounted(() => {
  window.addEventListener("keyup", (event) => {
    if (event.key == "Enter") {
      if (isChatting.value) {
        chatRef.value.methods.sendMsg();
      } else {
        document.getElementById("inputChat")?.focus();
        isChatting.value = true;
      }
    }
    if (event.key == "Escape" && isChatting.value) {
      document.getElementById("inputChat")?.blur();
    } else if (event.key == "Escape") {
      menuRef.value.methods.closeMenu();
    }
    if (event.key == "t" && !isChatting.value) {
      menuRef.value.methods.toogleMenu();
    }
  });
});

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
  background: rgba(30, 43, 2, 0.8);
  border: 2px solid var(--main-color);
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 12px;
  transition: transform 0.2s ease-out;
  background-position: center;
  background-size: 37px 37px;
  background-repeat: no-repeat;
}

.settingsBtn:hover {
  transform: scale(1.15, 1.15);
  cursor: pointer;
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

.setting-choice {
  line-height: 2em;
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
</style>
