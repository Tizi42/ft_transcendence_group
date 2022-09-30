<template>
  <div class="chat">
    <div class="container-channels">
      <NavChat
        @selectedNav="handleSelectedNav"
        @resetReceiver="handleSelectedReceiver"
        @clearHistory="handleHistory"
      />
      <FriendsList
        v-if="isActive === 'players'"
        @selectReceiver="handleSelectedReceiver"
        @getHistory="handleHistory"
      />
      <ChannelsList v-else />
    </div>
    <!-- <MessagesView :receiver="receiver"></MessagesView> -->
    <div class="container-chat">
      <h3>on discussion with {{ receiver }}</h3>
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
      <div class="message-input" v-if="receiver != -1">
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
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Ref, ref, onBeforeMount, defineComponent } from "vue";
import socket from "@/socket";
import MessagesView from "../components/MessagesView.vue";
import { getUrlOf } from "@/router";
import { useUserStore } from "@/stores/user";
import "@/assets/styles/chat.css";
import NavChat from "@/components/chat/NavChat.vue";
import FriendsList from "@/components/chat/FriendsList.vue";
import ChannelsList from "@/components/chat/ChannelsList.vue";

const lastMessage: Ref<any> = ref([]);
const profile: Ref<any> = ref("");
const profileFrom: Ref<Array<any>> = ref([]);
const user: any = useUserStore();
const isActive: Ref<string> = ref("players");
const receiver: Ref<number> = ref(-1);
const messageText: Ref<string> = ref("");
const history: Ref<any> = ref([]);

const handleSelectedNav = (event: string) => {
  isActive.value = event;
};

const handleSelectedReceiver = (event: number) => {
  receiver.value = event;
}

const handleHistory = (event: Array<any>) => {
  history.value = event;
}

const onSubmit = () => {
  const data = {
    content: messageText.value,
    author: user.id,
    dest: receiver.value,
  };

  socket.emit("send_message", data, () => {
    messageText.value = "";
  });
}

onBeforeMount(async () => {
  user.doFetchFriends();
});

defineExpose(
  defineComponent({
    name: "ChatView",
  })
);
</script>
