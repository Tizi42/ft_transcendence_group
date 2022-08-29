<template>
  <div>
    <h1>This is the CHAT page</h1>
    <!-- <ul class="messages">
      <li v-for="(message, index) in messages" :key="index" class="message">
        {{ message.content }}
      </li> -->
    <!-- </ul> -->
    <form @submit.prevent="onSubmit" class="form">
      <textarea v-model="input" placeholder="Your message..." class="input" />
      <button class="send-button">Send</button>
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
});
onMounted(() => {
  socket.on("connect", function () {
    console.log("socket connected");
  });
  function isValid() {
    return input.value.lenght > 0;
  }
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
}
</script>

<style scoped>
.messages {
  margin: 0;
  padding: 20px;
}
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
</style>
