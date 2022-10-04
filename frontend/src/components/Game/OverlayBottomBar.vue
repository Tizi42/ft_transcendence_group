<template>
  <div class="overlayBottomBar">
    <FloatingMenu grid="true">
      <template #button>
        <div class="settingsBtn emoji" />
      </template>
      <template #choices>
        <div v-for="image in emojiArray" :key="image" class="emoji-choice">
          <div
            @click="sendEmoji(image)"
            :style="{ 'background-image': 'url(' + getImgUrl(image) + ')' }"
          ></div>
        </div>
      </template>
    </FloatingMenu>
    <SmallChat
      :user="user"
      :opponent="opponent"
      @getChatting="changeChattingStatus"
      @getLastMessage="changeLastMessage"
      ref="chatRef"
    />
    <button class="settingsBtn sound" />
    <button class="settingsBtn help" />
    <button class="settingsBtn settings" />
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, defineExpose, onMounted, ref, Ref } from "vue";
import { defineProps, defineEmits } from "vue";
import { userInfoStore } from "@/stores/user";
import FloatingMenu from "../utils/FloatingMenu.vue";
import SmallChat from "./SmallChat.vue";
import { Chat } from "@backend/chat/entities/chat.entity";

interface Props {
  user: userInfoStore;
  opponent: number;
}

defineProps<Props>();
const emit = defineEmits(["getLastMessageUp", "test"]);
const emojiArray: Array<string> = [];
const isChatting: Ref<boolean> = ref(false);
const chatRef = ref();

function getImgUrl(pic: string) {
  return require("../../assets/" + pic);
}

function changeLastMessage(message: Chat) {
  emit("getLastMessageUp", message);
}

function loadEmojis() {
  for (var i = 1; i < 38; i++) {
    emojiArray.push("icons/emojis/" + i + ".svg");
  }
}

function changeChattingStatus(event: boolean) {
  isChatting.value = event;
}

function sendEmoji(id: string) {
  console.log("send emoji", id);
}

function openEmojiBox() {
  console.log("openEmojiBox");
}

onMounted(() => {
  loadEmojis();
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
    }
    if (event.key == "t" && !isChatting.value) {
      openEmojiBox();
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

.emoji-choice {
  width: 20%;
  min-width: 20%;
  min-height: 25%;
  display: flex;
  align-items: left;
  justify-content: center;
}

.emoji-choice div {
  display: block;
  background-position: center;
  background-repeat: no-repeat;
  transition: all 0.5s ease;
  width: 80%;
}

.emoji-choice div:hover {
  cursor: pointer;
  transform: scale(1.2);
}
</style>
