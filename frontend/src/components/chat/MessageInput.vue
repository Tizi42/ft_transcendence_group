<template>
  <div class="message-input">
    <form
      @submit.prevent="onSubmit(receiver, selectedChannel)"
      :class="{
        userMuted: channel.muted.includes(user.id, 0),
        userNotMuted: !channel.muted.includes(user.id, 0),
      }"
    >
      <div class="div-message-input">
        <input
          v-if="!channel.muted.includes(user.id, 0)"
          v-model="messageText"
          type="text"
          placeholder="Your message.."
          class="message-text"
        />
        <input
          v-else
          v-model="messageText"
          type="text"
          placeholder="Your message.."
          class="message-text"
          disabled
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
  channel: any;
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
  } else if (selectedChannel >= 0) {
    console.log("selected channel id = ", selectedChannel);
    const data = {
      content: messageText.value,
      authorId: props.user.id,
      channelId: selectedChannel,
    };
    console.log("data message = ", data);
    socket.emit("send_channel_message", data, () => {
      messageText.value = "";
    });
  }
};

defineExpose(
  defineComponent({
    name: "MessageInput",
  })
);
</script>
