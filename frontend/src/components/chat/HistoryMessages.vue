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
    <img
      src="@/assets/icons/inviteInGame.png"
      alt="invite in game"
      @click="inviteInGame"
    />
  </div>
  <div class="manage-channel" v-if="selectedChannel != -1 && channel">
    <div>
      <img
        id="see-members"
        src="@/assets/icons/groupUser.svg"
        alt="See members"
        @click="showMembers"
      />
    </div>
    <img
      id="add-member-button"
      src="@/assets/icons/icon-add.png"
      alt="add member"
      @click="addMember"
      v-if="channel.owner === user.id && channel.type === 'private'"
    />
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
      @click="showSettings"
      v-if="channel.owner === user.id"
    />
  </div>
  <div
    class="container-messages"
    v-if="isActive === 'players' || selectedChannel != -1"
  >
    <div v-for="message in history" :key="message.id">
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
    <UserBoxModal
      v-if="userProfileWindow && target"
      @hideUserBox="hide"
      :target="target"
    />
    <ChannelBoxModal
      v-if="(settingsWindow || membersWindow) && channel"
      @hide="hide"
    >
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
        v-if="isShowUserProfile && userTarget"
        :target="userTarget"
        :context="'channel'"
        @closeUserBox="hideUserBox"
      />
    </ChannelBoxModal>
    <InvitationModal
      @hideInvitation="hideInvitation"
      v-if="inviteWindow && target"
      :friend="target"
    />
    <MyModal v-if="addMemberWindow && channel" @hide="hide">
      <AddMember :channel="channel" />
    </MyModal>
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
  onBeforeUnmount,
  onBeforeMount,
} from "vue";
import UserBox from "../users/UserBox/UserBox.vue";
import { User } from "@backend/users/users.entity";
import SettingsChannelBox from "./ChannelBox/SettingsChannelBox.vue";
import ChannelBoxModal from "./ChannelBox/ChannelBoxModal.vue";
import MembersListBox from "./ChannelBox/MembersListBox.vue";
import { getUrlOf } from "@/router";
import socket from "@/socket";
import UserBoxModal from "../users/UserBox/UserBoxModal.vue";
import InvitationModal from "../Game/invitation/InvitationModal.vue";
import AddMember from "./AddMember.vue";
import MyModal from "../users/UserFriends/MyModal.vue";
import { Channel } from "@backend/channel/entities/channel.entity";
import { Chat } from "@backend/chat/entities/chat.entity";
import { StoreGeneric } from "pinia";

interface Props {
  history: Array<Chat>;
  target: User | null;
  isActive: string;
  selectedChannel: number;
  channel: Channel | null;
}

const props: Readonly<Props> = defineProps<Props>();
const user: StoreGeneric = useUserStore();
const userProfileWindow: Ref<boolean> = ref(false);
const settingsWindow: Ref<boolean> = ref(false);
const membersWindow: Ref<boolean> = ref(false);
const inviteWindow: Ref<boolean> = ref(false);
const addMemberWindow: Ref<boolean> = ref(false);
const isShowUserProfile: Ref<boolean> = ref(false);
const userTarget: Ref<User | null> = ref(props.target);

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

function addMember() {
  addMemberWindow.value = true;
}

function hide() {
  userProfileWindow.value = false;
  settingsWindow.value = false;
  membersWindow.value = false;
  isShowUserProfile.value = false;
  addMemberWindow.value = false;
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
  }
}

async function showUserProfile(event: number) {
  await fetch(getUrlOf("api/users/info/" + event), {
    credentials: "include",
  })
    .then((response: Response) => {
      return response.json();
    })
    .then((data) => {
      userTarget.value = data;
    });
  isShowUserProfile.value = true;
}

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

onBeforeMount(() => {
  socket.on("hide_window", (userToBanId: number) => {
    if (user.id === userToBanId) {
      hide();
    }
  });
});

onBeforeUnmount(() => {
  socket.off("hide_window");
});

defineExpose(
  defineComponent({
    name: "HistoryMessages",
  })
);
</script>
