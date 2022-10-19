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
        @getHistory="handleHistory"
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
        :history="history"
        :target="receiverProfile"
        :isActive="isActive"
        :selectedChannel="selectedChannel"
        :channel="channel"
      />
      <MessageInput
        v-if="receiver != -1 || selectedChannel != -1"
        :user="user"
        :receiver="receiver"
        :selectedChannel="selectedChannel"
        :channel="channel"
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
import { User } from "@backend/users/users.entity";
import AllChannelsSelected from "@/components/chat/AllChannelsSelected.vue";
import socket from "@/socket";

const user: any = useUserStore();
const isActive: Ref<string> = ref("players");
const receiver: Ref<number> = ref(-1);
const history: Ref<Array<any>> = ref([]);
const receiverProfile: Ref<any> = ref(null);
const selectedChannel: Ref<number> = ref(-1);
const allMyChannels: Ref<Array<any>> = ref([]);
const channel: Ref<any> = ref(null);

const handleSelectedNav = async (event: string) => {
  isActive.value = event;
  if (event === "players") {
    selectedChannel.value = -1;
  } else {
    allMyChannels.value = [];
    await fetch(getUrlOf("api/channel/"), {
      credentials: "include",
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        allMyChannels.value = data;
      })
      .catch((error) => {
        console.log("error :", error);
      });
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
  channel.value = null;
  for (let i = 0; i < allMyChannels.value.length; i++) {
    if (allMyChannels.value[i].id === selectedChannel.value) {
      channel.value = allMyChannels.value[i];
    }
  }
};

socket.on("channel_updated", async (channelId: number) => {
  allMyChannels.value = [];
  await fetch(getUrlOf("api/channel/"), {
    credentials: "include",
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      allMyChannels.value = data;
    })
    .catch((error) => {
      console.log("error :", error);
    });
  for (let i = 0; i < allMyChannels.value.length; i++) {
    if (allMyChannels.value[i].id === channelId) {
      channel.value = allMyChannels.value[i];
    }
  }
});

socket.on("banned_user", async (userToBanId: number, channelId: number) => {
  if (user.id === userToBanId) {
    socket.emit("leave_channel", {
      channelId: channelId,
      userId: user.id,
    });
  } else {
    allMyChannels.value = [];
    await fetch(getUrlOf("api/channel/"), {
      credentials: "include",
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        allMyChannels.value = data;
      })
      .catch((error) => {
        console.log("error :", error);
      });
    for (let i = 0; i < allMyChannels.value.length; i++) {
      if (allMyChannels.value[i].id === channelId) {
        channel.value = allMyChannels.value[i];
      }
    }
  }
});

onBeforeMount(async () => {
  user.doFetchFriends();
});

defineExpose(
  defineComponent({
    name: "ChatView",
  })
);
</script>
