<template>
  <div>
    <h1>This is the CHAT page</h1>
    <div class="sender">
      <p class="message">{{ profile.username }}:</p>
      <h3 v-for="(message, index) in history" :key="index" class="message">
        {{ date[index] }}:
        {{ history[index] }}
      </h3>
    </div>
    <form @submit.prevent="onSubmit" @keyup.enter="onSubmit" class="form">
      <textarea v-model="input" placeholder="Your message..." class="input" />
      <button :disabled="input === ''" class="send-button">Send</button>
    </form>
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
const date: Ref<any> = ref([]);
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
    // getMessages();
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
        date.value.push(el.created_at);
        history.value.push(el.content);
      });
    })
    .catch((err) => console.error(err));
}
</script>

<style scoped>
.form {
  padding: 10px;
}
.input {
  width: 80%;
  resize: none;
  padding: 10px;
  line-height: 1.5;
  border-radius: 5px;
  border: 1px solid #000;
}
.send-button {
  vertical-align: top;
}
.message {
  background: #e7e7e7;
  border-radius: 10px;
  padding: 1rem;
  width: fit-content;
}
</style>
