<template>
  <div>
    <h1>This is the Game page</h1>
    <!-- <ul class="messages">
      <li v-for="(message, index) in messages" :key="index" class="message">
        {{ message.content }}
      </li> -->
    <!-- </ul> -->
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
  methods: {},
  computed: {},
  created() {
    socket.on("connect", function () {
      console.log("socket connected");
    });
    socket.emit("send_message", function () {
      console.log("front");
    });
  },
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
