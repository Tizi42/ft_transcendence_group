<template>
  <div class="chat">
    <h1>This is the chat page</h1>
    <div class="container-list-users">
      <h3>List of all existing users</h3>
      <ul v-for="user in listOfUsers" :key="user">
        <li>
          {{ user.username }}:
          <span
            v-if="
              connectedUsers.find((elem) => elem.username === user.username)
            "
            >online
          </span>
          <span v-else>offline</span>
        </li>
      </ul>
    </div>
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
import { onBeforeMount, Ref, ref } from "vue";
import socket from "@/socket";

const messages: Ref<Array<any>> = ref([]);
const messageText: Ref<string> = ref("");
const listOfUsers: Ref<Array<any>> = ref([]);
const connectedUsers: Ref<Array<any>> = ref([]);

const sendMessage = () => {
  socket.emit("send_message", messageText.value, () => {
    messageText.value = "";
  });
};

onBeforeMount(async () => {
  socket.emit("request_all_messages", {}, (response: any) => {
    console.log(response);
  });

  socket.on("send_all_messages", (response) => {
    messages.value = response;
  });

  socket.on("receive_message", (message) => {
    messages.value.push(message);
  });

  socket.emit("request_all_users", {}, (response: any) => {
    console.log(response);
  });

  socket.on("users", (users) => {
    connectedUsers.value = users;
  });

  await fetch("http://localhost:3000/api/users", {
    credentials: "include",
  })
    .then((response) => {
      return response.json();
    })
    .then((data: any) => {
      listOfUsers.value = data;
    })
    .catch((error) => {
      console.log("ERROR : ", error);
    });
});
</script>

<style>
.chat {
  color: white;
}

.container-chat {
  border-top: 1px solid white;
}
</style>
