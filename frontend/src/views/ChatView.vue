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
      <img src="@/assets/icons/multiBubble.svg" />
      <HistoryMessages :history="history" :target="receiverProfile" />
      <MessageInput v-if="receiver != -1" :user="user" :receiver="receiver" />
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
import { getUrlOf } from "@/router";
import { User } from "@backend/users/users.entity";

const user: any = useUserStore();
const isActive: Ref<string> = ref("players");
const receiver: Ref<number> = ref(-1);
const history: Ref<Array<any>> = ref([]);
const receiverProfile: Ref<User | undefined> = ref();

const handleSelectedNav = (event: string) => {
  isActive.value = event;
};

const handleSelectedReceiver = async (event: number) => {
  receiver.value = event;
  if (receiver.value != -1) {
    await fetch(getUrlOf("api/users/info/" + receiver.value))
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        receiverProfile.value = data;
      })
      .catch((error) => {
        console.log("ERROR : ", error);
      });
  }
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
