<template>
  <div class="message-input">
    <form
      @submit.prevent="onSubmit(receiver, selectedChannel)"
      v-if="receiver != -1"
    >
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
    <form
      v-if="selectedChannel != -1 && channel"
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
          placeholder="You've been muted for 1 minutes.."
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
import { Channel } from "@backend/channel/entities/channel.entity";
import { StoreGeneric } from "pinia";
import {
  defineComponent,
  ref,
  Ref,
  defineProps,
  defineExpose,
  onBeforeMount,
  onBeforeUnmount,
  onUnmounted,
} from "vue";

interface Props {
  user: StoreGeneric;
  receiver: number;
  selectedChannel: number;
  channel: Channel | null;
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
      authorId: props.user.id,
      destId: receiver,
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

onBeforeMount(() => {
  socket.on("muted_by", (channelId: number, userId: number) => {
    console.log("You've been muted by", userId, "in channel id", channelId);
  });
});

onBeforeUnmount(() => {
  socket.off("muted_by");
});

onUnmounted(() => {
  socket.off("muted_by");
});

defineExpose(
  defineComponent({
    name: "MessageInput",
  })
);
</script>
