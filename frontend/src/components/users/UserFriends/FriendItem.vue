<template>
  <div class="friend-item">
    <div
      class="avatar-frame"
      ref="avatarFrame"
      :style="{
        'background-image': 'url(' + friend.picture + ')',
      }"
    ></div>
    <div class="info">
      <div class="name">
        {{ smallDisplayName(friend.displayName) }}
        <span class="id">(#{{ friend.id }})</span>
      </div>
      <div class="status">
        <div v-if="friend.status === 'offline'" class="grey-point"></div>
        <div v-if="friend.status === 'online'" class="green-point"></div>
        <div v-if="friend.status === 'in game'" class="red-point"></div>
        <div class="status-text" ref="statusText">{{ friend.status }}</div>
      </div>
    </div>
    <button
      class="friend-menu-button"
      @click="onClickFriend"
      v-text="buttonText"
    ></button>
    <FriendItemMenu
      v-if="show"
      :style="{ left: clickCoord.x + 'px', top: clickCoord.y + 'px' }"
      @hideMenu="hide"
      @inviting="inviteToPlay"
      :friend="friend"
    />
    <teleport to="body" v-if="inviteWindow">
      <InvitationModal
        @hideInvitation="hideInvitation"
        :friend="props.friend"
      />
    </teleport>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, defineExpose, defineProps, ref, computed } from "vue";
import FriendItemMenu from "./FriendItemMenu.vue";
import InvitationModal from "../../game/invitation/InvitationModal.vue";
import { User } from "@backend/users/users.entity";

interface Props {
  friend: User;
}

const props: Readonly<Props> = defineProps<Props>();
const show = ref(false);
const buttonText = computed(() => (show.value === true ? "+" : "="));
const clickCoord = ref({
  x: 0,
  y: 0,
});
const inviteWindow = ref(false);

function smallDisplayName(displayName: string): string {
  let small = displayName.split(" ")[0].slice(0, 10);
  if (small.length > 10) return small + ".";
  return small;
}

function onClickFriend(event: MouseEvent) {
  clickCoord.value.x = event.pageX - 100;
  clickCoord.value.y = event.pageY + 10;
  show.value = !show.value;
  console.log("click", show.value);
}

function hide() {
  show.value = false;
}

function inviteToPlay() {
  hide();
  inviteWindow.value = true;
}

function hideInvitation() {
  inviteWindow.value = false;
}

defineExpose(
  defineComponent({
    name: "FriendItem",
  })
);
</script>

<style scoped>
.friend-item {
  white-space: nowrap;
  overflow: hidden;
  display: flex;
  min-width: 300px;
  width: 100%;
  height: 110px;
  background-color: rgba(20, 29, 1, 1);
  border-radius: 12px;
}

.avatar-frame {
  margin-left: 0.5em;
  display: inline-block;
  border-radius: 100%;
  background-position: center;
  background-size: cover;
  min-width: 70px;
  height: 70px;
  align-self: center;
  margin-left: 7%;
}

.info {
  align-self: center;
  color: white;
  margin-left: 6%;
  font-family: "Outfit";
  text-align: left;
}

.name {
  font-weight: 500;
  font-size: 24px;
  color: rgba(255, 203, 0, 1);
}

.id {
  font-size: 14px;
}

.status {
  margin-top: 0.4em;
  display: flex;
  align-items: center;
}

.status div {
  width: 10px;
  height: 10px;
  margin: 0;
  border-radius: 100%;
  margin-right: 10px;
  padding: 0;
}

.grey-point {
  background-color: #939694;
}

.green-point {
  background-color: #12d654;
}

.red-point {
  background-color: red;
}

.status-text {
  font-weight: 300;
  font-size: 14px;
  width: 6em;
  line-height: 14px;
}

.friend-menu-button {
  align-self: flex-start;
  color: #ffcb00;
  font-size: 26px;
  font-weight: 600;
  background: transparent;
  margin: 2% 5% 0 auto;
  border: none;
}
</style>
