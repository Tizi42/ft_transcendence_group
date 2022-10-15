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
      <ChannelsList
        v-else
        @getChannelSelected="handleChannelSelected"
        :selectedChannel="selectedChannel"
        :user="user"
      />
    </div>
    <div class="container-chat">
      <AllChannelsSelected
        v-if="isActive === 'channels' && selectedChannel == -1"
        @getChannelSelected="handleChannelSelected"
      />
      <HistoryMessages
        v-if="receiverProfile != null"
        :history="history"
        :target="receiverProfile"
        :isActive="isActive"
        :selectedChannel="selectedChannel"
      />
      <MessageInput
        v-if="receiver != -1 || selectedChannel != -1"
        :user="user"
        :receiver="receiver"
        :selectedChannel="selectedChannel"
      />
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
import MessageInput from "@/components/chat/MessageInput.vue";
import { getUrlOf } from "@/router";
import AllChannelsSelected from "@/components/chat/AllChannelsSelected.vue";
import { Chat } from "@backend/chat/entities/chat.entity";
import { User } from "@backend/users/users.entity";

const user: any = useUserStore();
const isActive: Ref<string> = ref("players");
const receiver: Ref<number> = ref(-1);
const history: Ref<Array<Chat>> = ref([]);
const receiverProfile: Ref<User | null> = ref(null);
const selectedChannel: Ref<number> = ref(-1);

const handleSelectedNav = (event: string) => {
  isActive.value = event;
  if (event === "players") {
    selectedChannel.value = -1;
  }
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
  } else {
    receiverProfile.value = null;
  }
};

const handleHistory = (event: Array<any>) => {
  history.value = event;
};

const handleChannelSelected = (event: number) => {
  selectedChannel.value = event;
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
