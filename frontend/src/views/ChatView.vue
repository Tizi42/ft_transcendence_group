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
      <button :disabled="!isValid" class="send-button">Send</button>
    </form>
  </div>
</template>

<script lang="ts">
import socket from "../socket";

export default {
  data() {
    return {
      input: "",
    };
  },
  methods: {
    onSubmit() {
      socket.emit("input", this.input);
      this.input = "";
    },
  },
  computed: {
    isValid() {
      return this.input.length > 0;
    },
  },
  created() {
    socket.on("connect", function () {
      console.log("socket connected");
    });
    socket.emit("send_message", function () {
      console.log("front");
    });
  },
  // unmounted() {
  //   socket.off("connect");
  //   socket.off("input");
  // },
};
</script>

<script lang="ts" setup>
import { Ref, ref, onBeforeMount } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const profile: Ref<any> = ref("");

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
