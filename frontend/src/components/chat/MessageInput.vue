<template>
  <div class="message-input">
    <form @submit.prevent="onSubmit">
      <input
        v-model="messageText"
        type="text"
        placeholder="Your message.."
        class="message-text"
      />
      <button type="submit">
        <img src="@/assets/icons/send-icon.png" alt="send-message" />
      </button>
    </form>
  </div>
</template>

<script lang="ts" setup>
import socket from "@/socket";
import { User } from "@backend/users/users.entity";
import { defineComponent, ref, Ref, defineProps, defineExpose } from "vue";

interface Props {
  user: any;
  receiver: number;
}

const props: Readonly<Props> = defineProps<Props>();
const messageText: Ref<string> = ref("");

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
};

defineExpose(
  defineComponent({
    name: "MessageInput",
  })
);
</script>
