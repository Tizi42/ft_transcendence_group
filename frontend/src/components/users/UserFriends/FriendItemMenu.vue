<template>
  <div class="friend-menu" ref="menu">
    <div class="friend-menu-option">Invite to play &nbsp;&nbsp;&nbsp;></div>
    <div class="friend-menu-option">Spectate game</div>
    <div class="friend-menu-option">Send a message</div>
    <div class="friend-menu-option" @click="onRemoveFriend">Delete friend</div>
    <div class="friend-menu-option" @click="onBlockUser">Block this user</div>
  </div>
</template>

<script lang="ts" setup>
import {
  ref,
  defineComponent,
  defineExpose,
  defineProps,
  defineEmits,
} from "vue";
import { useUserStore } from "@/stores/user";
import { useClickOutside } from "@/composables/useClickOutside";
import axios from "axios";

const user = useUserStore();
const props = defineProps(["friend"]);
const emit = defineEmits(["hide"]);
const menu = ref(null);

function onRemoveFriend() {
  console.log("remove ", props.friend.id);
  axios
    .post("http://localhost:3000/api/users/friends/rm/", {
      id1: user.id,
      id2: props.friend.id,
    })
    .then((response) => {
      user.doFetchFriends();
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
  emit("hide");
}

function onBlockUser() {
  console.log("block ", props.friend.id);
  axios
    .post("http://localhost:3000/api/users/block/add/", {
      id1: user.id,
      id2: props.friend.id,
    })
    .then((response) => {
      user.doFetchFriends();
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
  emit("hide");
}

useClickOutside(menu, () => {
  emit("hide");
});

defineExpose(
  defineComponent({
    name: "FriendItemMenu",
  })
);
</script>

<style scoped>
.friend-menu {
  width: 227px;
  height: 246px;
  background-color: rgba(20, 29, 1, 1);
  position: absolute;
  color: rgba(255, 203, 0, 1);
  text-align: left;
}

.friend-menu-option {
  width: 185px;
  margin: 17px 0 0 25px;
  font-family: "Outfit";
  font-weight: 400;
  font-size: 22px;
  line-height: 28px;
}

.friend-menu-option:hover {
  cursor: pointer;
  transform: scale(1.05, 1.05);
}
</style>
