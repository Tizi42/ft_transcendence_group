<template>
  <div class="chat">
    <div class="container-chat">
      <div class="container-messages">
        <!-- <div>[{{ messages }}]</div> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { io } from "socket.io-client";
import { onBeforeMount, Ref, ref } from "vue";

const socket = io("http://localhost:3000");
const messages: Ref<Array<any>> = ref([]);

onBeforeMount(() => {
  socket.emit("request_all_messages", {}, (response: any) => {
    messages.value = response;
  });
});
</script>
