<template>
  <div class="friends-section">
    <div class="friends-buttons">
      <div v-if="user.pending.length">
        <div class="pending-grid">
          <FriendReqItem
            v-for="req in user.pending"
            :key="req.id"
            :sender="req"
          />
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
    <div v-if="user.friends.length">
      <div class="friends-grid">
        <FriendItem
          v-for="friend in user.friends"
          :key="friend.id"
          :friend="friend"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, defineExpose, ref } from "vue";
import { onBeforeMount } from "vue";
import { useUserStore } from "@/stores/user";
import FriendItem from "./FriendItem.vue";
import FriendReqItem from "./FriendReqItem.vue";
import AddFriend from "./AddFriend.vue";
import MyModal from "./MyModal.vue";
import socket from "@/socket";

const user = useUserStore();
const addWindow = ref(false);

function onAdd() {
  addWindow.value = true;
}

function hide() {
  addWindow.value = false;
}

onBeforeMount(() => {
  user.doFetchFriends();
  user.doFetchPending();
  socket.on("receive_friendship", () => {
    user.doFetchPending();
    user.doFetchFriends();
  });
  socket.on("friend_update", () => {
    user.doFetchFriends();
    user.doFetchPending();
  });
});

defineExpose(
  defineComponent({
    name: "UserFriends",
  })
);
</script>

<style scoped>
.friends-section {
  position: absolute;
  top: 0;
  width: 86%;
  margin-left: 7%;
  margin-right: 7%;
  display: flex;
  flex-direction: column;
  justify-content: center;
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
  width: 99%;
  grid-gap: 5px;
  margin-bottom: 20px;
}

.friends-grid {
  max-height: 500px;
  overflow-y: scroll;
  display: grid;
  grid-gap: 15px;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  margin-bottom: 50px;
  scrollbar-width: 0px;
}

.friends-grid::-webkit-scrollbar {
  display: none;
}
</style>
