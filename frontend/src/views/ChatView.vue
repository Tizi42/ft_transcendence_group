<template>
  <div class="chatPage">
    <h1>This is the CHAT page</h1>
    <div class="chatroom">
      <div
        class="messageBlock"
        v-for="(message, index) in history"
        :key="index"
      >
        <p class="message message-out">
          {{ history[index] }}
          <!-- {{ timestamp }} -->
        </p>
        <img :src="profile.picture" class="photo" />
      </div>
      <form @submit.prevent="onSubmit" @keyup.enter="onSubmit" class="form">
        <textarea v-model="input" placeholder="Your message..." class="input" />
        <button :disabled="input === ''" class="send-button">Send</button>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Ref, ref, onBeforeMount, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import socket from "../socket";

const router = useRouter();
const profile: Ref<any> = ref("");
const input: Ref<any> = ref("");
const history: Ref<any> = ref([]);
const timestamp: Ref<any> = ref([]);
const index = 0;

onBeforeMount(async () => {
  await fetch("http://localhost:3000/api/private", {
    credentials: "include",
  })
    .then((response) => {
      if (response.status != 200) {
        router.push({
          name: "login",
        });
        return response.json();
      }
      return response.json();
    })
    .then((user) => {
      profile.value = user;
      console.log(user);
    })
    .catch((error) => {
      console.log(error);
    });
  getMessages();
});
onMounted(() => {
  socket.on("connect", function () {
    console.log("socket connected");
  });
});
onUnmounted(() => {
  socket.off("connect");
  socket.off("send_message");
});
function onSubmit() {
  const data = {
    content: input.value,
    author: profile.value.username,
  };
  socket.emit("send_message", data);
  input.value = null;
  window.location.reload();
}
function getMessages() {
  fetch("http://localhost:3000/api/chat")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((el: any) => {
        history.value.push(el.content);
      });
    })
    .catch((err) => console.error(err));
}
function getTime() {
  const today = new Date();
  const date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  const time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const dateTime = date + " " + time;
  timestamp.value = dateTime;
  console.log(timestamp.value);
}
</script>

<style scoped>
.chatPage {
  height: 100vh;
  width: 100vw;
  background: linear-gradient(
    116.6deg,
    #005f3e -20.9%,
    #feca00 99.99%,
    #ffda00 100%
  );
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
}
.message-out {
  color: white;
  background: #0d4134e7;
  min-width: 50px;
  padding: 10px;
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
.messageBlock {
  display: flex;
  justify-content: right;
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
</style>
