<template>
  <div class="chatPages">
    <div class="chatroom">
      <div
        v-for="(message, index) in history"
        :key="index"
        class="messageBlockOut"
      >
        <p class="message message-out">
          {{ history[index] }}
        </p>
        <img :src="profile.picture" class="photo" />
      </div>
      <!-- <div
        v-for="(messageFrom, index) in historyFrom"
        :key="index"
        class="messageBlockIn"
      >
        <p class="message message-in">
          {{ historyFrom[index] }}
        </p>
        <img :src="profileFrom.picture" class="photo" />
      </div> -->
      <form @submit.prevent="onSubmit" @keyup.enter="onSubmit" class="form">
        <textarea v-model="input" placeholder="Your message..." class="input" />
        <button :disabled="input === ''" class="send-button">Send</button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "MessagesView",
});
</script>

<script setup lang="ts">
import { onBeforeMount, Ref, ref, defineProps } from "vue";
import socket from "../socket";

const input: Ref<any> = ref("");
const history: Ref<any> = ref([]);
const profile: Ref<any> = ref("");
const index = ref(0);

defineProps(["profileFrom"]);

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
  getMessages();
});

function onSubmit() {
  const data = {
    content: input.value,
    author: 4,
    dest: 1,
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
</script>

<style scoped>
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
.messageBlockIn {
  display: flex;
  justify-content: left;
}
</style>
