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
      <div class="name">{{ sender.displayName }}</div>
      <div class="message">sent you a friend request</div>
    </div>
    <button>accept</button>
    <button>ignore</button>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, defineExpose, defineProps } from "vue";
import { useUserStore } from "@/stores/user";

const user = useUserStore();
const props = defineProps(["sender"]); //later: delete userstore and use this prop instead

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
