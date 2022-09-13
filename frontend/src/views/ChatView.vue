<template>
  <div class="chatPage">
    <h1>This is the CHAT page</h1>
    <div v-for="(message, index) in history" :key="index" class="chatroom">
      <p class="message">
        {{ history[index] }}
      </p>
      <img :src="profileFrom.picture" class="photo" />
    </div>
    <MessagesView></MessagesView>
  </div>
</template>

<script lang="ts" setup>
import { Ref, ref, onBeforeMount, onUnmounted } from "vue";
import socket from "../socket";
import MessagesView from "../components/MessagesView.vue";

const history: Ref<any> = ref([]);
const profile: Ref<any> = ref("");
const profileFrom: Ref<any> = ref("");
const index = ref(0);

onBeforeMount(async () => {
  await fetch("http://localhost:3000/api/private", {
    credentials: "include",
  })
    .then((response) => {
      return response.json();
    })
    .then((user) => {
      profile.value = user;
    })
    .catch((error) => {
      console.log(error);
    });
  getAllDest();
  getLastMessage();
});
onUnmounted(() => {
  socket.off("send_messag 18e");
});
function getAllDest() {
  fetch("http://localhost:3000/api/chat/dest")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((el: any) => {
        console.log(el.dest.id);
        profileFrom.value = el.dest;
      });
    })
    .catch((err) => console.error(err));
}
function getLastMessage() {
  fetch("http://localhost:3000/api/chat/" + 4)
    .then((response) => response.json())
    .then((data) => {
      data.forEach((el: any) => {
        console.log("HISTORY = " + el.content);
        history.value.push(el.content);
      });
    })
    .catch((err) => console.error(err));
}
</script>

<style>
.chatPage {
  background: linear-gradient(
    116.6deg,
    #005f3e -20.9%,
    #feca00 99.99%,
    #ffda00 100%
  );
  height: 100vh;
  width: 100vw;
  padding-top: 2em;
  padding-bottom: 5em;
}
.chatroom {
  overflow-y: scroll;
  scroll-behavior: smooth;
  background: #1e2b02;
  border-radius: 22px;
  width: 90%;
  padding: 5px;
  margin: 5% 5% 10% 5%;
  overflow: auto;
  box-shadow: 2px 2px 5px 2px rgba(0, 0, 0, 0.3);
}
.photo {
  position: relative;
  display: block;
  width: 35px;
  height: 35px;
  border-radius: 80px;
  margin-top: 2%;
  margin-left: 2%;
  box-shadow: 2px 2px 5px 2px rgba(0, 0, 0, 0.3);
}
.messageBlockOut {
  display: flex;
  justify-content: right;
}
</style>
