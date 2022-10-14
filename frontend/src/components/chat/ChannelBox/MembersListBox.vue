<template>
  <div>
    <h2>Members list</h2>
    <div class="manage-members-list">
      <ul>
        <li
          v-for="member in channel.members"
          :key="member"
          class="members-list"
        >
          <div class="avatar-frame">
            <img :src="member.picture" />
          </div>
          <div class="friend-frame">
            <div v-if="member.status === 'offline'" class="grey-point"></div>
            <div v-if="member.status === 'online'" class="green-point"></div>
            <h3>{{ member.displayName }}</h3>
          </div>
          <div>
            <button
              type="submit"
              id="ban-button"
              @click="banUser(member.id)"
              v-if="channel.admins.includes(user.id, 0)"
            >
              ban
            </button>
            <button
              type="submit"
              id="mute-button"
              @click="muteUser(member.id)"
              v-if="channel.admins.includes(user.id, 0)"
            >
              mute
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from "@/stores/user";
import { ref, defineComponent, defineExpose, Ref, defineProps } from "vue";

interface Props {
  channel: any;
}

const user = useUserStore();
const props: Readonly<Props> = defineProps<Props>();

const banUser = (id: number) => {
  console.log("ban user id", id, "from channel", props.channel.name);
};

const muteUser = (id: number) => {
  console.log(
    "mute user id",
    id,
    "from channel",
    props.channel.name,
    "for ? time"
  );
};

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
  width: 35vw;
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
#mute-button {
  cursor: pointer;
  transition: transform 0.5s ease;
}

.members-list .avatar-frame img:hover,
#ban-button:hover,
#mute-button:hover {
  transform: scale(1.1, 1.1);
}

#ban-button,
#mute-button {
  background-color: #ffcb00;
  border: none;
  color: #1e2b02;
  border-radius: 14px;
  padding: 0.5em;
  font-weight: bold;
  font-size: 0.8em;
}

#mute-button {
  margin-left: 10px;
}
</style>
