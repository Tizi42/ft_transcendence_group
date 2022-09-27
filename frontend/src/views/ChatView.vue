<template>
  <div class="chat">
    <div class="container-channels">
      <div class="nav-channels">
        <button
          id="players-col"
          :class="{ selected: isActive === 'players' }"
          @click="select('players')"
        >
          Players
        </button>
        <button
          id="channels-col"
          :class="{ selected: isActive === 'channels' }"
          @click="select('channels')"
        >
          Channels
        </button>
      </div>
      <div class="list-friends" v-if="isActive === 'players'">
        <ul>
          <li v-for="friend in user.friends" :key="friend">{{ friend }}</li>
          <li>user 1</li>
        </ul>
      </div>
      <div class="list-channels" v-else>
        <ul>
          <li>channel</li>
        </ul>
      </div>
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
import { useUserStore } from "@/stores/user";
import "@/assets/styles/chat.css";

const messages: Ref<Array<any>> = ref([]);
const messageText: Ref<string> = ref("");
const user = useUserStore();
const isActive: Ref<string> = ref("players");

socket.on("new_connection", async () => {
  user.doFetchFriends();
});

const sendMessage = () => {
  socket.emit("send_message", messageText.value, () => {
    messageText.value = "";
  });
};

const select = (id: string) => {
  isActive.value = id;
};

onBeforeMount(async () => {
  socket.emit("request_all_messages", {}, (response: any) => {
    messages.value = response;
  });

  socket.on("receive_message", (message: any) => {
    messages.value.push(message);
  });

  user.doFetchFriends();
});
</script>
