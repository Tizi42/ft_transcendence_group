<template>
  <div>
    <h2 @click="test">Members list</h2>
    <div class="manage-members-list">
      <ul>
        <li
          v-for="member in channel.members"
          :key="member.id"
          class="members-list"
        >
          <div class="avatar-frame">
            <img :src="member.picture" @click="emitUserProfile(member.id)" />
          </div>
          <div class="friend-frame">
            <div v-if="member.status === 'offline'" class="grey-point"></div>
            <div v-if="member.status === 'online'" class="green-point"></div>
            <div v-if="member.status === 'in game'" class="red-point"></div>
            <h3>{{ member.displayName }}</h3>
          </div>
          <div>
            <button
              type="submit"
              id="ban-button"
              @click="banUser(member.id, member.displayName)"
              v-if="
                channel.admins.includes(user.id, 0) &&
                !channel.admins.includes(member.id, 0) &&
                !channel.banned.includes(member.id, 0)
              "
            >
              ban
            </button>
            <button
              type="submit"
              id="banned-button"
              v-if="channel.banned.includes(member.id, 0)"
            >
              banned
            </button>
            <button
              type="submit"
              id="mute-button"
              @click="muteUser(member.id, member.displayName)"
              v-if="
                channel.admins.includes(user.id, 0) &&
                !channel.admins.includes(member.id, 0) &&
                !channel.muted.includes(member.id, 0)
              "
            >
              mute
            </button>
            <button
              type="submit"
              id="muted-button"
              v-if="channel.muted.includes(member.id, 0)"
            >
              muted
            </button>
            <button
              type="submit"
              id="make-admin"
              @click="makeAdmin(member.id, member.displayName)"
              v-if="
                channel.owner === user.id &&
                !channel.admins.includes(member.id, 0)
              "
            >
              make admin
            </button>
            <button id="admin" v-if="channel.admins.includes(member.id, 0)">
              Admin
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import socket from "@/socket";
import { useUserStore } from "@/stores/user";
import { Channel } from "@backend/channel/entities/channel.entity";
import { StoreGeneric } from "pinia";
import { defineComponent, defineExpose, defineProps, defineEmits } from "vue";

interface Props {
  channel: Channel;
}

const user: StoreGeneric = useUserStore();
const props: Readonly<Props> = defineProps<Props>();

const test = () => {
  console.log("channel members = ", props.channel.members);
};

const banUser = (id: number, displayName: string) => {
  if (confirm(`Are you sure you want to ban ${displayName} for 2 hours ?`)) {
    socket.emit("ban_member", {
      channelId: props.channel.id,
      userId: user.id,
      userToBanId: id,
    });
    console.log("ban user id", id, "from channel", props.channel.name);
  } else {
    console.log("user no banned");
  }
};

const muteUser = (id: number, displayName: string) => {
  if (confirm(`Are you sure you want to mute ${displayName} for 1 minutes ?`)) {
    socket.emit("mute_user", {
      channelId: props.channel.id,
      userId: user.id,
      userToMuteId: id,
    });
    console.log(
      "mute user id",
      id,
      "from channel",
      props.channel.name,
      "for ? time"
    );
  } else {
    console.log("user not muted");
  }
};

const makeAdmin = (id: number, displayName: string) => {
  if (confirm(`Are you sure you want to make ${displayName} a new admin ?`)) {
    socket.emit("make_admin", {
      channelId: props.channel.id,
      userId: user.id,
      newAdminId: id,
    });
    console.log("make admin user id", id);
  } else {
    console.log("no new admin");
  }
};

const emitUserProfile = (userId: number) => {
  emit("getUserProfile", userId);
};

const emit = defineEmits(["getUserProfile"]);

defineExpose(
  defineComponent({
    name: "MembersListBox",
  })
);
</script>

<style>
.manage-members-list {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  height: 28vh;
  overflow: auto;
  margin-top: 20px;
}

h2 {
  margin: 0;
  color: #ffcb00;
}

.members-list {
  width: 40vw;
  max-width: 800px;
  margin: 0;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  padding: 0.5em;
}

.members-list .friend-frame {
  flex: 2;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.members-list .avatar-frame img,
#ban-button,
#mute-button,
#make-admin {
  cursor: pointer;
  transition: transform 0.5s ease;
}

.members-list .avatar-frame img:hover,
#ban-button:hover,
#mute-button:hover,
#make-admin:hover {
  transform: scale(1.1, 1.1);
}

#ban-button,
#mute-button,
#make-admin,
#admin,
#muted-button,
#banned-button {
  border: none;
  border-radius: 14px;
  padding: 0.5em;
  font-weight: bold;
  font-size: 0.8em;
}

#ban-button,
#mute-button,
#make-admin,
#muted-button,
#banned-button {
  background-color: #ffcb00;
  color: #1e2b02;
}

#muted-button,
#banned-button {
  opacity: 60%;
}

#admin {
  background-color: #1e2b02;
  color: #005f3e;
  border: 3px solid #005f3e;
}

#mute-button,
#make-admin,
#muted-button,
#banned-button {
  margin-left: 10px;
}
</style>
