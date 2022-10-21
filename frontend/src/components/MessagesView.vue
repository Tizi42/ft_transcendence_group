<template>
  <div class="box chat">
    <div id="echange">
      <div v-for="(message, index) in history" :key="index">
        <div v-if="message.author.id === 11" class="messageBlockOut">
          <p class="message message-out">
            {{ message.content }}
          </p>
          <img :src="message.author.picture" class="photo" />
        </div>
        <div v-else class="messageBlockIn">
          <img :src="message.dest.picture" class="photo" />
          <p class="message message-in">
            {{ message.content }}
          </p>
        </div>
      </div>
    </div>
    <form @submit.prevent="onSubmit" class="form">
      <input v-model="input" placeholder="Your message..." class="input" />
      <button type="submit" :disabled="input === ''" class="send-button">
        Send
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "MessagesView",
});
</script>

<script setup lang="ts">
import { Ref, ref, defineProps, onBeforeMount } from "vue";
import socket from "../socket";
import { getUrlOf } from "@/router";
import { useUserStore } from "@/stores/user";
import { Chat } from "@backend/chat/entities/chat.entity";

const input: Ref<string> = ref("");
const history: Ref<Chat[]> = ref([]);
//const profile: Ref<any> = ref([]);
const prop = defineProps(["chosenProfile"]);
console.log("how : ", prop.chosenProfile.id);
const user = useUserStore();

onBeforeMount(async () => {
  console.log("profile = ", user.id);
  getMessages();
});

function onSubmit() {
  const data = {
    content: input.value,
    author: user.id,
    dest: 7,
  };
  console.log("dest =", data.dest);
  socket.emit("send_message", data);
  input.value = "";
  window.location.reload();
}

function getMessages() {
  console.log("profile = ", 7);
  fetch(getUrlOf("api/chat/messages/" + 7))
    .then((response) => response.json())
    .then((data) => {
      data.forEach((el: Chat) => {
        console.log("history = ", el);
        history.value.push(el);
      });
    })
    .catch((err) => console.error(err));
}
</script>

<style scoped>
.chat {
  width: 100%;
  margin-right: 5%;
}
.input {
  border-radius: 12px;
  background: #ffffff;
  width: 90%;
}
.message {
  border-radius: 10px;
  font-size: 80%;
  box-shadow: 2px 2px 5px 2px rgba(0, 0, 0, 0.3);
}
.message-in {
  background: #f1f0f0;
  color: black;
  min-width: 50px;
  padding: 10px;
}
.message-out {
  color: white;
  background: #0d4134e7;
  min-width: 50px;
  padding: 10px;
}
.messageBlockOut {
  display: flex;
  justify-content: right;
}
.messageBlockIn {
  display: flex;
  justify-content: left;
}
#echange {
  display: flex;
  flex-direction: column;
}
</style>
