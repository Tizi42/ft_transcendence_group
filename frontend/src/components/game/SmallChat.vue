<template>
  <div class="chatBarContainer">
    <input
      id="inputChat"
      class="chatBar"
      v-model="message"
      :placeholder="placeHolder()"
      :maxlength="maxLen()"
      @focusin="chatting(true)"
      @focusout="chatting(false)"
      @submit="sendMsg"
    />
    <button class="sendMsg" @click="sendMsg" />
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, defineExpose, ref, Ref } from "vue";
import { defineProps, defineEmits } from "vue";
import socket from "@/socket";
import { UserMinimal } from "@/components/utils/UserMinimal";
import { messageInGame } from "@backend/chat/utils/types";

interface Props {
  user: UserMinimal;
  room_name: string;
  role: string;
}

const props: Readonly<Props> = defineProps<Props>();
const emit = defineEmits(["getChatting"]);
const message: Ref<string> = ref("");

function placeHolder(): string {
  if (props.role == "watch") return "Chat in viewers chat...";
  return "Chat here...";
}

function maxLen(): number {
  if (props.role == "watch") return 500;
  return 80;
}

function sendMsg() {
  if (message.value != "") {
    const data: messageInGame = {
      content: message.value,
      author: props.user.id.toString(),
      dest: props.room_name,
    };
    socket.emit("send_message_ingame", data);
    document.getElementById("inputChat")?.blur();
    message.value = "";
  }
}

function chatting(is: boolean) {
  emit("getChatting", is);
}

defineExpose(
  defineComponent({
    name: "SmallChatBar",
    methods: {
      sendMsg,
    },
  })
);
</script>

<style scoped>
.chatBarContainer {
  display: flex;
  flex-direction: row;
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
  box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 22px;
}

.chatBarContainer input {
  font-family: "Outfit";
  color: #575757;
}

.chatBar {
  border: none;
  background: none;
  width: 100%;
  padding-left: 1em;
  font-size: 18px;
  line-height: 25px;
  color: #575757;
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
