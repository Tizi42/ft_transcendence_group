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
        :myChannels="allMyChannels"
      />
    </div>
    <div class="container-chat">
      <AllChannelsSelected
        v-if="isActive === 'channels' && selectedChannel == -1"
        @getChannelSelected="handleChannelSelected"
        :user="user"
      />
      <HistoryMessages
        :history="history"
        :target="receiverProfile"
        :isActive="isActive"
        :selectedChannel="selectedChannel"
        :channel="channel"
        v-if="receiverProfile || selectedChannel != -1"
      />
      <MessageInput
        v-if="(receiver != -1 && receiverProfile) || selectedChannel != -1"
        :user="user"
        :receiver="receiver"
        :selectedChannel="selectedChannel"
        :channel="channel"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  Ref,
  ref,
  onBeforeMount,
  defineComponent,
  defineExpose,
  onBeforeUnmount,
} from "vue";
import { useUserStore } from "@/stores/user";
import NavChat from "@/components/chat/NavChat.vue";
import FriendsList from "@/components/chat/FriendsList.vue";
import ChannelsList from "@/components/chat/ChannelsList.vue";
import HistoryMessages from "@/components/chat/HistoryMessages.vue";
import MessageInput from "@/components/chat/MessageInput.vue";
import { getUrlOf } from "@/router";
import AllChannelsSelected from "@/components/chat/AllChannelsSelected.vue";
import socket from "@/socket";
import { Chat } from "@backend/chat/entities/chat.entity";
import { StoreGeneric } from "pinia";
import { Channel } from "@backend/channel/entities/channel.entity";
import { User } from "@backend/users/users.entity";

const user: StoreGeneric = useUserStore();
const isActive: Ref<string> = ref("players");
const receiver: Ref<number> = ref(-1);
const history: Ref<Array<Chat>> = ref([]);
const receiverProfile: Ref<User | null> = ref(null);
const selectedChannel: Ref<number> = ref(-1);
const allMyChannels: Ref<Array<Channel>> = ref([]);
const channel: Ref<Channel | null> = ref(null);

const handleSelectedNav = async (event: string) => {
  isActive.value = event;
  if (event === "players" || selectedChannel.value != -1) {
    selectedChannel.value = -1;
  } else {
    allMyChannels.value = [];
    await fetch(getUrlOf("api/channel/"), {
      credentials: "include",
    })
      .then((response: Response) => {
        return response.json();
      })
      .then((data) => {
        allMyChannels.value = data;
      })
      .catch((error: Error) => {
        console.log("error :", error);
      });
  }
};

const handleSelectedReceiver = async (event: number) => {
  receiver.value = event;
  if (receiver.value != -1) {
    await fetch(getUrlOf("api/users/info/" + receiver.value))
      .then((response: Response) => {
        return response.json();
      })
      .then((data) => {
        receiverProfile.value = data;
      })
      .catch((error: Error) => {
        console.log("ERROR : ", error);
      });
  } else {
    receiverProfile.value = null;
  }
};

const handleHistory = (event: Array<Chat>) => {
  history.value = event;
};

const handleChannelSelected = async (event: number) => {
  selectedChannel.value = event;
  channel.value = null;
  for (let i = 0; i < allMyChannels.value.length; i++) {
    if (allMyChannels.value[i].id === selectedChannel.value) {
      channel.value = allMyChannels.value[i];
      console.log("channel id ", event, "=", channel.value);
    }
  }
};

socket.on("channel_updated", async () => {
  user.doFetch();
  await fetch(getUrlOf("api/channel/"), {
    credentials: "include",
  })
    .then((response: Response) => {
      return response.json();
    })
    .then((data) => {
      allMyChannels.value = [];
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].members.length; j++) {
          if (data[i].members[j].id === user.id) {
            allMyChannels.value.push(data[i]);
            break;
          }
        }
      }
    })
    .catch((error: Error) => {
      console.log("error :", error);
    });
  console.log("my channels = ", allMyChannels.value);
  for (let i = 0; i < allMyChannels.value.length; i++) {
    if (allMyChannels.value[i].id === selectedChannel.value) {
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
      .then((response: Response) => {
        return response.json();
      })
      .then((data) => {
        allMyChannels.value = data;
      })
      .catch((error: Error) => {
        console.log("error :", error);
      });
    for (let i = 0; i < allMyChannels.value.length; i++) {
      if (allMyChannels.value[i].id === channelId) {
        channel.value = allMyChannels.value[i];
      }
    }
  }
});

socket.on("friend_login_logout", async () => {
  user.doFetchFriends();
});

onBeforeMount(async () => {
  user.doFetchFriends();
  socket.emit("remove_chat_notification");
});

onBeforeUnmount(() => {
  socket.off("channel_updated");
  socket.off("banned_user");
  socket.off("friend_login_logout");
  socket.emit("remove_chat_notification");
});

defineExpose(
  defineComponent({
    name: "ChatView",
  })
);
</script>
