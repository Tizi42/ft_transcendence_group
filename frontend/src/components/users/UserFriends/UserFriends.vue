<template>
  <div class="friends-section">
    <div class="friends-buttons">
      <div v-if="pending">
        <div class="pending-grid">
          <FriendReqItem v-for="req in pending" :key="req" :sender="req" />
        </div>
      </div>
      <img
        class="icon-button"
        src="@/assets/icons/icon-add.png"
        alt="add button"
        @click="onAdd"
      />
      <teleport to="body">
        <MyModal v-if="addWindow" @hide="hide">
          <AddFriend />
        </MyModal>
      </teleport>
      <img
        class="icon-button"
        src="@/assets/icons/icon-filter.png"
        alt="filter button"
      />
    </div>
    <div v-if="friends">
      <div class="friends-grid">
        <FriendItem v-for="friend in friends" :key="friend" :friend="friend" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, defineExpose, ref, onBeforeMount } from "vue";
import { useUserStore } from "@/stores/user";
import FriendItem from "./FriendItem.vue";
import FriendReqItem from "./FriendReqItem.vue";
import AddFriend from "./AddFriend.vue";
import MyModal from "./MyModal.vue";

import axios from "axios";

const user = useUserStore();
const friends = ref();
const pending = ref();
const addWindow = ref(false);

async function doFetchFriends() {
  await fetch("http://localhost:3000/api/users/friends/" + user.id, {
    credentials: "include",
  })
    .then((response) => {
      return response.json();
    })
    .then((list) => {
      console.log(list);
      friends.value = list;
    })
    .catch((error) => {
      console.log(error);
    });
}

async function doFetchPending() {
  await fetch("http://localhost:3000/api/users/friends/from/" + user.id, {
    credentials: "include",
  })
    .then((response) => {
      return response.json();
    })
    .then((list) => {
      console.log("pending:", list);
      pending.value = list;
    })
    .catch((error) => {
      console.log(error);
    });
}

function onAdd() {
  addWindow.value = true;
  console.log("set add window true");
}

function hide() {
  addWindow.value = false;
}

onBeforeMount(() => {
  doFetchFriends();
  doFetchPending();
});

defineExpose(
  defineComponent({
    name: "UserFriends",
  })
);
</script>

<style scoped>
.friends-section {
  width: 86%;
  margin-left: 7%;
  margin-right: 7%;
}

.friends-buttons {
  text-align: right;
}

.icon-button {
  margin: 5px 15px 15px 5px;
  height: 24px;
  width: 24px;
  display: inline-block;
}

.icon-button:hover {
  cursor: pointer;
  transform: scale(1.1, 1.1);
}

.pending-grid {
  display: grid;
  grid-template-columns: 1fr;
  width: 77%;
  grid-gap: 5px;
  margin-bottom: 20px;
}

.friends-grid {
  max-height: 500px;
  overflow-y: scroll;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  width: 99%;
  grid-gap: 15px;
  margin-bottom: 50px;
}
</style>
