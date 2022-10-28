<template>
  <div class="request-frame">
    <div class="info">
      <div class="message">
        <div class="name">
          {{ sender.displayName }}<span class="id">(#{{ sender.id }})</span>
        </div>
        wants to be friends with you!
      </div>
    </div>
    <div class="button-section">
      <button
        class="buttons"
        id="button-accept"
        @click="onHandleFriendRequest('accept')"
      >
        accept
      </button>
      <button
        class="buttons"
        id="button-ignore"
        @click="onHandleFriendRequest('ignore')"
      >
        ignore
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, defineExpose, defineProps } from "vue";
import { useUserStore } from "@/stores/user";
import axios from "axios";
import socket from "@/socket";
import { getUrlOf } from "@/router";
import { StoreGeneric } from "pinia";

const user: StoreGeneric = useUserStore();
const props = defineProps(["sender"]);

async function onHandleFriendRequest(action: string) {
  const data = {
    from: user.id.toString(),
    to: props.sender.id.toString(),
  };
  axios
    .post(
      getUrlOf("api/users/friends/") + action,
      {
        id1: props.sender.id,
        id2: user.id,
      },
      {
        withCredentials: true,
      }
    )
    .then(() => {
      socket.emit("update_friend", data);
      user.doFetchPending();
      user.doFetchFriends();
    });
}

defineExpose(
  defineComponent({
    name: "FriendReqItem",
  })
);
</script>

<style scoped>
.request-frame {
  font-family: "Outfit";
  color: white;
  display: flex;
  width: 100%;
  height: 50px;
  background-color: rgba(20, 29, 1, 1);
  border-radius: 12px;
  white-space: nowrap;
}

.info {
  display: flex;
  align-self: center;
  margin-left: 5%;
  text-align: left;
  font-family: "Outfit";
  font-size: 20px;
}

.name {
  display: inline;
  border-bottom: 2px solid;
  color: rgba(255, 203, 0, 0.7);
  text-decoration-skip-ink: none;
  font-size: 22px;
}
.name:hover {
  cursor: pointer;
}

.id {
  font-size: 16px;
}

.button-section {
  align-self: center;
  margin-right: 5%;
  margin-left: auto;
}

.buttons {
  align-self: center;
  font-family: "Outfit";
  font-size: 18px;
  border: none;
  border-radius: 12px;
  margin-left: 1em;
  padding: 0.2em 1em 0.2em 1em;
  color: white;
  background-color: rgba(30, 42, 2, 0.7);
}

#button-accept {
  background-color: rgba(18, 214, 84, 0.8);
}

#button-ignore {
  background-color: rgba(212, 57, 29, 0.8);
}

#button-ignore:hover,
#button-accept:hover {
  cursor: pointer;
  transform: scale(1.1, 1.1);
}
</style>
