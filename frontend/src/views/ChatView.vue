<template>
  <div class="chat">
    <div class="container-channels">
      <div class="nav-channels">
        <button
          v-bind:class="{ players_col: isPlayers }"
          @click="selectPlayers"
        >
          Players
        </button>
        <button
          v-bind:class="{ channels_col: isChannels }"
          @click="selectChannels"
        >
          Channels
        </button>
      </div>
      <div class="list-friends">
        <p v-for="friend in user.friends" :key="friend">{{ friend }}</p>
      </div>
      <div class="list-channels">
        <p>channel</p>
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
const isPlayers: Ref<boolean> = ref(false);
const isChannels: Ref<boolean> = ref(false);

socket.on("new_connection", async () => {
  user.doFetchFriends();
});

const sendMessage = () => {
  socket.emit("send_message", messageText.value, () => {
    messageText.value = "";
  });
};

const selectPlayers = () => {
  isPlayers.value = !isPlayers.value;
  isChannels.value = !isChannels.value;
};

const selectChannels = () => {
  isPlayers.value = !isPlayers.value;
  isChannels.value = !isChannels.value;
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
