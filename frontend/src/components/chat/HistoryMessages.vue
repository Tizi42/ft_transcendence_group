<template>
  <div v-if="target === null && isActive === 'players'" class="welcome-chat">
    <img src="@/assets/icons/multiBubble.svg" />
    <h1>Let's chat</h1>
  </div>
  <div
    class="messages-invite-game"
    v-if="target != null && isActive === 'players'"
  >
    <img src="@/assets/icons/watchGame.svg" alt="watch his game" />
    <img src="@/assets/icons/inviteInGame.png" alt="invite in game" />
  </div>
  <div class="manage-channel" v-if="selectedChannel != -1">
    <div>
      <img
        id="see-members"
        src="@/assets/icons/groupUser.svg"
        alt="See members"
        @click="showMembers()"
      />
    </div>
    <img
      id="leave-img"
      src="@/assets/icons/leave.png"
      alt="leave channel"
      @click="leaveChannel(selectedChannel)"
    />
    <img
      id="settings-img"
      src="@/assets/icons/settings.svg"
      alt="see settings"
      @click="showSettings()"
      v-if="channel[0].admins.includes(user.id, 0)"
    />
  </div>
  <div
    class="container-messages"
    v-if="isActive === 'players' || selectedChannel != -1"
  >
    <div v-for="message in history" :key="message">
      <div
        v-if="message.author.id != user.id"
        class="messages"
        id="from-others"
      >
        <img :src="message.author.picture" @click="showInfoBox" />
        <p>{{ message.content }}</p>
      </div>
      <div class="messages" id="from-user" v-else>
        <img :src="message.author.picture" />
        <p>{{ message.content }}</p>
      </div>
    </div>
  </div>
  <teleport to="body">
    <UserBoxModal v-if="userProfileWindow" @hide="hide">
      <UserBox :target="target" />
    </UserBoxModal>
    <ChannelBoxModal v-if="settingsWindow || membersWindow" @hide="hide">
      <SettingsChannelBox
        :selectedChannel="selectedChannel"
        :channel="channel[0]"
        v-if="settingsWindow"
      />
      <MembersListBox v-if="membersWindow" :channel="channel[0]" />
    </ChannelBoxModal>
  </teleport>
</template>

<script lang="ts" setup>
import { useUserStore } from "@/stores/user";
import {
  defineComponent,
  defineProps,
  defineExpose,
  Ref,
  ref,
  watch,
} from "vue";
import UserBoxModal from "../users/UserBox/UserBoxModal.vue";
import UserBox from "../users/UserBox/UserBox.vue";
import { User } from "@backend/users/users.entity";
import SettingsChannelBox from "./ChannelBox/SettingsChannelBox.vue";
import ChannelBoxModal from "./ChannelBox/ChannelBoxModal.vue";
import MembersListBox from "./ChannelBox/MembersListBox.vue";
import { getUrlOf } from "@/router";
import socket from "@/socket";

interface Props {
  history: Array<any>;
  target: User;
  isActive: string;
  selectedChannel: number;
}

const props: Readonly<Props> = defineProps<Props>();
const user: any = useUserStore();
const userProfileWindow: Ref<boolean> = ref(false);
const settingsWindow: Ref<boolean> = ref(false);
const membersWindow: Ref<boolean> = ref(false);
const channel: Ref<Array<any>> = ref([]);

function showInfoBox() {
  userProfileWindow.value = true;
}

function showSettings() {
  settingsWindow.value = true;
}

function showMembers() {
  membersWindow.value = true;
}

function hide() {
  userProfileWindow.value = false;
  settingsWindow.value = false;
  membersWindow.value = false;
}

function leaveChannel(selectedChannel: number) {
  if (confirm("Are you sure you want to leave this channel ?")) {
    socket.emit("leave_channel", {
      channelId: selectedChannel,
      userId: user.id,
    });
    console.log("leaving the channel");
  } else {
    console.log("not leaving the channel");
  }
}

watch(
  () => props.selectedChannel,
  async (newSelectedChannel) => {
    await fetch(getUrlOf("api/channel/members/" + newSelectedChannel), {
      credentials: "include",
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        channel.value = data;
      })
      .catch((error) => {
        console.log("Error :", error);
      });
  }
);

socket.on("new_admin", async (channelId: number) => {
  channel.value = [];
  await fetch(getUrlOf("api/channel/members/" + channelId), {
    credentials: "include",
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      channel.value = data;
    })
    .catch((error) => {
      console.log("Error :", error);
    });
});

socket.on("exited_channel_members", async (channelId: number) => {
  channel.value = [];
  await fetch(getUrlOf("api/channel/members/" + channelId), {
    credentials: "include",
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      channel.value = data;
    })
    .catch((error) => {
      console.log("Error :", error);
    });
});

socket.on("banned_user", async (userToBanId: number, channelId: number) => {
  if (user.id === userToBanId) {
    socket.emit("leave_channel", {
      channelId: channelId,
      userId: user.id,
    });
    hide();
  } else {
    channel.value = [];
    await fetch(getUrlOf("api/channel/members/" + channelId), {
      credentials: "include",
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        channel.value = data;
      })
      .catch((error) => {
        console.log("Error :", error);
      });
  }
});

watch(
  () => props.target,
  () => {
    const element = document.getElementsByClassName("container-messages")[0];
    element.scrollTop = element.scrollHeight;
  }
);

defineExpose(
  defineComponent({
    name: "HistoryMessages",
  })
);
</script>
