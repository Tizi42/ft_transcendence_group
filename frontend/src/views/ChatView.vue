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
      <ul class="list-friends" v-if="isActive === 'players'">
        <li v-for="friend in user.friends" :key="friend">
          <div class="avatar-frame">
            <img :src="friend.picture" />
          </div>
          <div class="friend-frame">
            <div v-if="friend.status === 'offline'" class="red-point"></div>
            <div v-if="friend.status === 'online'" class="green-point"></div>
            <h3>{{ friend.username }}</h3>
          </div>
        </li>
      </ul>
      <ul class="list-channels" v-else>
        <li>channel</li>
      </ul>
    </div>
    <div class="container-chat">
      <div class="container-messages">
        <div v-for="message in messages" :key="message">
          <div
            class="messages"
            id="from-others"
            v-if="message.author.id != user.id"
          >
            <img :src="message.author.picture" />
            <p>{{ message.content }}</p>
          </div>
          <div class="messages" id="from-user" v-else>
            <img :src="message.author.picture" />
            <p>{{ message.content }}</p>
          </div>
        </div>
      </div>
      <div class="message-input">
        <form @submit.prevent="sendMessage">
          <input
            v-model="messageText"
            type="text"
            placeholder="Your message.."
            class="message-text"
          />
          <button type="submit">
            <img src="@/assets/icons/send-icon.png" alt="send-message" />
          </button>
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
const user: any = useUserStore();
const isActive: Ref<string> = ref("players");

socket.on("new_connection", async () => {
  user.doFetchFriends();
});

const sendMessage = () => {
  console.log("here");
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
