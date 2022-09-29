<template>
  <div class="overlayBottomBar">
    <FloatingMenu>
      <template #button>
        <button class="settingsBtn emoji" />
      </template>
      <template #choices>
        <div>Choice 1</div>
        <div>Choice 2</div>
        <div>Choice 3</div>
        <div>Choice 4</div>
        <div>Choice 1</div>
        <div>Choice 2</div>
        <div>Choice 3</div>
        <div>Choice 4</div>
        <div>Choice 1</div>
      </template>
    </FloatingMenu>
    <div class="chatBarContainer">
      <input
        id="inputChat"
        class="chatBar"
        v-model="message"
        placeholder="Chat here..."
        @focusin="chatting(true)"
        @focusout="chatting(false)"
        @submit="sendMsg"
      />
      <button class="sendMsg" @click="sendMsg" />
    </div>
    <button class="settingsBtn sound" />
    <button class="settingsBtn help" />
    <button class="settingsBtn settings" />
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, defineExpose, onMounted, ref, Ref } from "vue";
import FloatingMenu from "../utils/FloatingMenu.vue";

const message: Ref<string> = ref("");
const isChatting: Ref<boolean> = ref(false);
function sendMsg() {
  if (message.value != "") {
    console.log("sending msg :", message.value);
    message.value = "";
  }
}

function chatting(is: boolean) {
  isChatting.value = is;
}

function openEmojiBox() {
  console.log("openEmojiBox");
}

onMounted(() => {
  window.addEventListener("keyup", (event) => {
    if (event.key == "Enter") {
      if (isChatting.value) sendMsg();
      else {
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
}

.settingsBtn:hover {
  transform: scale(1.15, 1.15);
  cursor: pointer;
}

.chatBarContainer {
  display: flex;
  flex-direction: row;
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
  box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 22px;
}

.chatBar {
  border: none;
  background: none;
  width: 100%;
  padding-left: 1em;
  color: #575757;
  font-size: 18px;
  line-height: 25px;
}

.chatBar:focus {
  color: #bebebe;
  outline: none;
}

.sendMsg {
  height: 50px;
  width: 50px;
  background: none;
  border: none;
  opacity: 0.3;
  background-image: url("@/assets/icons/sendMsg.svg");
  background-position: center;
  background-size: 34px 34px;
  background-repeat: no-repeat;
  padding-right: 6%;
}

.sendMsg:hover {
  cursor: pointer;
}
</style>
