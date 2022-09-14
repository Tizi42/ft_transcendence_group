<template>
  <div class="chat">
    <h1>This is the chat page</h1>
    <div class="container-chat">
      <div class="container-messages">
        <div v-for="message in messages" :key="message">
          [ {{ message.author.username }} ]: {{ message.content }}
        </div>
      </div>
      <div class="message-input">
        <form @submit.prevent="sendMessage">
          <label>Message : </label>
          <input v-model="messageText" />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { io } from "socket.io-client";
import { onBeforeMount, Ref, ref } from "vue";

const socket = io("http://localhost:3000", {
  withCredentials: true,
});

const messages: Ref<Array<any>> = ref([]);
const messageText: Ref<string> = ref("");

onBeforeMount(() => {
  socket.emit("request_all_messages", {}, (response: any) => {
    messages.value = response;
  });

  socket.on("send_all_messages", (response) => {
    messages.value = response;
  });

  socket.on("receive_message", (message) => {
    messages.value.push(message);
  });
});

const sendMessage = () => {
  socket.emit("send_message", messageText.value, () => {
    messageText.value = "";
  });
};
</script>

<style>
.chat {
  color: white;
}
</style>
