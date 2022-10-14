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
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineComponent, defineExpose, Ref, defineProps } from "vue";

interface Props {
  channel: any;
}

const props: Readonly<Props> = defineProps<Props>();

const showChannel = () => {
  console.log("props channel = ", props.channel.name);
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
  width: 30vw;
  margin: 0;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  padding: 0.5em;
}

.members-list .friend-frame {
  flex: 2;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.members-list .avatar-frame img {
  cursor: pointer;
  transition: transform 0.5s ease;
}

.members-list .avatar-frame img:hover {
  transform: scale(1.1, 1.1);
}
</style>
