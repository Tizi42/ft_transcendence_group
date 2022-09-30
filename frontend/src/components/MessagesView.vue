<template>
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
          v-model="input"
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
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "MessagesView",
});
</script>

<script setup lang="ts">
import { Ref, ref, defineProps, onMounted, onUpdated } from "vue";
import socket from "../socket";
import { getUrlOf } from "@/router";
import { useUserStore } from "@/stores/user";

const input: Ref<any> = ref("");
const history: Ref<any> = ref([]);
const profile: Ref<any> = ref([]);
const prop = defineProps(["chosenProfile"]);
const user = useUserStore();
console.log("how : ", prop.chosenProfile.id);

onMounted(async () => {
  console.log("profile = ", user.id);
  getMessages();
});

console.log("profile chosen = ", prop.chosenProfile.id);

function onSubmit() {
  const data = {
    content: input.value,
    author: user.id,
    dest: 3,
  };
  console.log("dest =", data.dest);
  socket.emit("send_message", data);
  input.value = null;
  window.location.reload();
}

function getMessages() {
  fetch(getUrlOf("api/chat/messages/" + 3))
    .then((response) => response.json())
    .then((data) => {
      data.forEach((el: any) => {
        console.log("history = ", el);
        history.value.push(el);
      });
    })
    .catch((err) => console.error(err));
}
</script>
