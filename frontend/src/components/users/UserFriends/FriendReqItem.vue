<template>
  <div class="friend-item">
    <div
      class="avatar-frame"
      ref="avatarFrame"
      :style="{
        'background-image': 'url(' + sender.picture + ')',
      }"
    ></div>
    <div class="info">
      <div class="name">{{ sender.displayName }}#{{ sender.id }}</div>
      <div class="message">sent you a friend request</div>
    </div>
    <button @click="onHandleFriendRequest('accept')">accept</button>
    <button @click="onHandleFriendRequest('ignore')">ignore</button>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, defineExpose, defineProps } from "vue";
import { useUserStore } from "@/stores/user";
import axios from "axios";

const user = useUserStore();
const props = defineProps(["sender"]); //later: delete userstore and use this prop instead

function onHandleFriendRequest(action: string) {
  axios
    .post("http://localhost:3000/api/users/friends/" + action, {
      id1: props.sender.id,
      id2: user.id,
    })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
  user.doFetch();
}

defineExpose(
  defineComponent({
    name: "FriendReqItem",
  })
);
</script>

<style scoped>
.friend-item {
  display: flex;
  width: 100%;
  min-width: 260px;
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
  border: 3px solid #ffcb00;
}
</style>
