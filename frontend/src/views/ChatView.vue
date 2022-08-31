<template>
  <div class="chatPage">
    <h1>This is the CHAT page</h1>
    <div class="sender">
      <p
        v-for="(message, index) in history"
        :key="index"
        class="message message-out"
      >
        {{ history[index] }}
        {{ date[index] }}
        <img :src="profile.picture" class="photo" />
      </p>
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
.chatPage {
  background: linear-gradient(
    116.6deg,
    #005f3e -20.9%,
    #feca00 99.99%,
    #ffda00 100%
  );
}
/* .form {
  padding: 10px;
} */
.input {
  border-radius: 18px;
  background: #ffffff;
  width: 791px;
  height: 90%;
  left: 426px;
  top: 836px;
}
.send-button {
  vertical-align: top;
}
.message {
  /* width: 40%; */
  border-radius: 10px;
  padding: 0.5em;
  font-size: 100%;
}
.message-in {
  background: #f1f0f0;
  color: black;
}
.message-out {
  margin-left: 55%;
  width: 30%;
  color: white;
  background: #141817;
  border-radius: 18px;
}

.sender {
  background: #1e2b02;
  border-radius: 22px;
  width: 90%;
  height: 20%;
  padding: 0.5em;
  overflow: auto;
  margin: 0 auto 1em auto;
  box-shadow: 2px 2px 5px 2px rgba(0, 0, 0, 0.3);
  /* display: inline-block; */
}
.sender.time {
}
#time {
  font-size: 10px;
}
.photo {
  /* position: absolute; */
  /* left: 83.54%;
  right: 11.67%;
  top: 49.41%;
  bottom: 44.14%; */
  /* height: 10%; */
  width: 20%;
  margin: 10% 0% 0% 20%;
  border-radius: 50px;
  margin-left: 105%;
  margin-right: 10%;
}
</style>
