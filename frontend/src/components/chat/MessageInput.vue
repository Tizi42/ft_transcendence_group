<template>
  <div class="message-input">
<<<<<<< HEAD
    <form @submit.prevent="onSubmit">
=======
    <form @submit.prevent="onSubmit(receiver, selectedChannel)">
>>>>>>> master
      <div class="div-message-input">
        <input
          v-model="messageText"
          type="text"
          placeholder="Your message.."
          class="message-text"
        />
        <button type="submit">
          <img src="@/assets/icons/send-icon.png" alt="send-message" />
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import socket from "@/socket";
import { defineComponent, ref, Ref, defineProps, defineExpose } from "vue";

interface Props {
  user: any;
  receiver: number;
<<<<<<< HEAD
=======
  selectedChannel: number;
>>>>>>> master
}

const props: Readonly<Props> = defineProps<Props>();
const messageText: Ref<string> = ref("");

<<<<<<< HEAD
const onSubmit = () => {
  if (messageText.value === "") {
    return;
  }
  const data = {
    content: messageText.value,
    author: props.user.id,
    dest: props.receiver,
  };

  socket.emit("send_message", data, () => {
    messageText.value = "";
  });
=======
const onSubmit = (receiver: number, selectedChannel: number) => {
  if (messageText.value === "") {
    return;
  }
  if (receiver >= 0) {
    const data = {
      content: messageText.value,
      author: props.user.id,
      dest: receiver,
    };

    socket.emit("send_message", data, () => {
      messageText.value = "";
    });
  } else {
    console.log("selected channel id = ", selectedChannel);
  }
>>>>>>> master
};

defineExpose(
  defineComponent({
    name: "MessageInput",
  })
);
</script>
