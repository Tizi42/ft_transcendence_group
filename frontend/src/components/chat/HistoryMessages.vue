<template>
  <div v-if="target === null && isActive === 'players'" class="welcome-chat">
    <img src="@/assets/icons/multiBubble.svg" />
    <h1>Let's chat</h1>
  </div>
  <div
    class="messages-invite-game"
    v-if="target != null && isActive === 'players'"
  >
    <div>
      <img
        id="see-profile-user"
        src="@/assets/icons/profile.svg"
        alt="see user profile"
        @click="showInfoBox"
      />
    </div>
    <!-- <img src="@/assets/icons/watchGame.svg" alt="watch his game" /> -->
    <img
      src="@/assets/icons/inviteInGame.png"
      alt="invite in game"
      @click="inviteInGame"
    />
  </div>
  <div class="manage-channel" v-if="selectedChannel != -1">
    <div>
      <img
        id="see-members"
        src="@/assets/icons/groupUser.svg"
        alt="See members"
        @click="showMembers"
      />
    </div>
    <img
      class="leave-img"
      src="@/assets/icons/leave.png"
      alt="leave channel"
      @click="leaveChannel(selectedChannel)"
    />
    <img
      id="settings-img"
      src="@/assets/icons/settings.svg"
      alt="see settings"
      @click="showSettings"
      v-if="channel.owner === user.id"
    />
    <AddMember :channel="channel" />
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
        <img :src="message.author.picture" />
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
        :channel="channel"
        v-if="settingsWindow"
      />
      <MembersListBox
        v-if="membersWindow && !isShowUserProfile"
        :channel="channel"
        @getUserProfile="showUserProfile"
      />
      <UserBox
        v-if="isShowUserProfile"
        :target="userTarget"
        :context="'channel'"
        @closeUserBox="hideUserBox"
      />
    </ChannelBoxModal>
    <InvitationModal @hideInvitation="hideInvitation" v-if="inviteWindow" />
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
import InvitationModal from "../game/invitation/InvitationModal.vue";
import AddMember from "@/components/chat/AddMember.vue";

interface Props {
  history: Array<any>;
  target: User;
  isActive: string;
  selectedChannel: number;
  channel: any;
}

const props: Readonly<Props> = defineProps<Props>();
const user: any = useUserStore();
const userProfileWindow: Ref<boolean> = ref(false);
const settingsWindow: Ref<boolean> = ref(false);
const membersWindow: Ref<boolean> = ref(false);
const inviteWindow: Ref<boolean> = ref(false);
const isShowUserProfile: Ref<boolean> = ref(false);
const userTarget: Ref<User> = ref(props.target);

function inviteInGame() {
  inviteWindow.value = true;
}

function showInfoBox() {
  userProfileWindow.value = true;
}

async function showSettings() {
  settingsWindow.value = true;
}

function showMembers() {
  membersWindow.value = true;
}

function hide() {
  userProfileWindow.value = false;
  settingsWindow.value = false;
  membersWindow.value = false;
  isShowUserProfile.value = false;
}

function hideUserBox() {
  isShowUserProfile.value = false;
}

function hideInvitation() {
  inviteWindow.value = false;
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

async function showUserProfile(event: number) {
  console.log("show user profile id =", event);
  await fetch(getUrlOf("api/users/info/" + event), {
    credentials: "include",
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      userTarget.value = data;
    })
    .catch((error) => {
      console.log("error : ", error);
    });
  isShowUserProfile.value = true;
}

socket.on("hide_window", (userToBanId: number) => {
  if (user.id === userToBanId) {
    hide();
  }
});

watch(
  () => props.history,
  () => {
    setTimeout(() => {
      const element = document.getElementsByClassName("container-messages")[0];
      if (element) {
        element.scrollTop = element.scrollHeight;
      }
    }, 1);
  }
);

defineExpose(
  defineComponent({
    name: "HistoryMessages",
  })
);
</script>
