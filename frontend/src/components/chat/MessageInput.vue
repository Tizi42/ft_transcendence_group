<template>
  <div class="message-input">
    <form @submit.prevent="onSubmit(receiver, selectedChannel)">
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
  selectedChannel: number;
}

const props: Readonly<Props> = defineProps<Props>();
const messageText: Ref<string> = ref("");

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
};

defineExpose(
  defineComponent({
    name: "MessageInput",
  })
);
</script>
