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
        :user="user"
      />
      <ChannelsList v-else />
    </div>
    <div class="container-chat">
      <h3>on discussion with {{ receiver }}</h3>
      <HistoryMessages :history="history" />
      <MessageInput v-if="receiver != 1" :user="user" :receiver="receiver" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Ref, ref, onBeforeMount, defineComponent, defineExpose } from "vue";
import { useUserStore } from "@/stores/user";
import "@/assets/styles/chat.css";
import NavChat from "@/components/chat/NavChat.vue";
import FriendsList from "@/components/chat/FriendsList.vue";
import ChannelsList from "@/components/chat/ChannelsList.vue";
import HistoryMessages from "@/components/chat/HistoryMessages.vue";
import MessageInput from "../components/chat/MessageInput.vue";

const user: any = useUserStore();
const isActive: Ref<string> = ref("players");
const receiver: Ref<number> = ref(-1);
const history: Ref<Array<any>> = ref([]);

const handleSelectedNav = (event: string) => {
  isActive.value = event;
};

const handleSelectedReceiver = (event: number) => {
  receiver.value = event;
};

const handleHistory = (event: Array<any>) => {
  history.value = event;
};

onBeforeMount(async () => {
  user.doFetchFriends();
});

defineExpose(
  defineComponent({
    name: "ChatView",
  })
);
</script>
