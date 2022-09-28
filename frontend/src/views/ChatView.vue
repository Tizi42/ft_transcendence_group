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
        <li
          v-for="friend in user.friends"
          :key="friend"
          @click="renderCorresponding(friend)"
        >
          <div class="avatar-frame">
            <img :src="friend.picture" />
          </div>
          <div class="friend-frame">
            <div v-if="friend.status === 'offline'" class="red-point"></div>
            <div v-if="friend.status === 'online'" class="green-point"></div>
            <h3>{{ friend.username }}</h3>
            <!-- <p>{{ lastMessage[profile] }}</p> -->
          </div>
        </li>
      </ul>
      <ul class="list-channels" v-else>
        <li>channel</li>
      </ul>
    </div>
    <!-- <MessagesView :chosenProfile="chosenProfile"></MessagesView> -->
    <div class="container-chat">
      <div class="container-messages">
        <div v-for="message in history" :key="message">
          <div
            class="messages"
            id="from-others"
            v-if="message.authorId != user.id"
          >
            <img :src="message.dest.picture" />
            <p>{{ message.content }}</p>
          </div>
          <div class="messages" id="from-user" v-else>
            <img :src="message.author.picture" />
            <p>{{ message.content }}</p>
          </div>
        </div>
      </div>
      <div class="message-input">
        <form @submit.prevent="onSubmit">
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
<!-- <template>
  <div class="chatPage">
    <h1>Start chating</h1>
    <div class="chatroom">
      <div class="box list">
        <div class="onglets">
          <p>Friends</p>
          <p>Channel</p>
        </div>
        <input type="text" placeholder="Search.." />
        <div
          class="block"
          v-for="profile in profileFrom"
          :key="profile"
          @click="renderCorresponding(profile)"
        >
          <img :src="profile.picture" class="photo select" />
          <div class="infos">
            <p id="userinfos">
              {{ profile.username }}
            </p>
            <p id="messagelist">
              {{ lastMessage[profile] }}
            </p>
          </div>
        </div>
      </div>
      <MessagesView :chosenProfile="chosenProfile"></MessagesView>
    </div>
  </div>
</template> -->

<script lang="ts" setup>
import { Ref, ref, onBeforeMount, onUnmounted, onMounted } from "vue";
import socket from "@/socket";
import MessagesView from "../components/MessagesView.vue";
import { getUrlOf } from "@/router";
import { useUserStore } from "@/stores/user";
import "@/assets/styles/chat.css";

const lastMessage: Ref<any> = ref([]);
const profile: Ref<any> = ref("");
const profileFrom: Ref<Array<any>> = ref([]);
const chosenProfile: Ref<any> = ref("");
const user: any = useUserStore();
const isActive: Ref<string> = ref("players");
const messageText: Ref<string> = ref("");
const history: Ref<any> = ref([]);

const select = (id: string) => {
  isActive.value = id;
};

function onSubmit() {
  const data = {
    content: messageText.value,
    author: user.id,
    dest: 1,
  };
  console.log("dest =", data.dest);
  socket.emit("send_message", data);
  messageText.value = "";
  window.location.reload();
}

function getMessages() {
  console.log("profile = ", 1);
  fetch(getUrlOf("api/chat/messages/" + 1))
    .then((response) => response.json())
    .then((data) => {
      data.forEach((el: any) => {
        console.log("history = ", el);
        history.value.push(el);
      });
    })
    .catch((err) => console.error(err));
}

onBeforeMount(async () => {
  await fetch(getUrlOf("api/chat/dest"))
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      getAllDest(data);
    })
    .catch((err) => {
      console.error(err);
    });
  user.doFetchFriends();
  getMessages();
});

function getAllDest(dest: any[]) {
  for (let i = 0; i < dest.length; i++) {
    if (dest[i].dest.id !== user.id) {
      profileFrom.value.push(dest[i].dest);
      getLastMessage(dest[i].dest.id);
    }
  }
  chosenProfile.value = profileFrom.value[profileFrom.value.length - 1];
}

function getLastMessage(id: number) {
  socket.emit("last_from", id, (response: any) => {
    lastMessage.value.push(response.content);
  });
}

function renderCorresponding(prof: any) {
  console.log("before = ", chosenProfile.value);
  chosenProfile.value = prof;
  console.log("after = ", chosenProfile.value);
}
</script>
