<template>
  <form id="search-form" @submit.prevent="onClickSearch">
    <input
      id="search-input"
      v-model="input"
      type="text"
      placeholder="Search by user id"
      required="true"
      autofocus
      :style="{ border: inputBorder }"
    />
    <input id="search-button" type="submit" value="Search" />
  </form>
  <div id="search-result" v-if="targetUser">
    <div class="target-info">
      <div
        class="avatar-frame"
        :style="{
          'background-image': 'url(' + targetUser.picture + ')',
        }"
      ></div>
      <div class="target-name">{{ targetUser.displayName }}</div>
    </div>
    <button v-if="pending" id="cancel-button" class="buttons" @click="onCancel">
      Cancel
    </button>
    <button
      v-if="!pending"
      id="send-button"
      class="buttons"
      @click="onSend"
      :disabled="friendWith"
    >
      Send
    </button>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineComponent, defineExpose } from "vue";
import { useUserStore } from "@/stores/user";
import socket from "@/socket";
import axios from "axios";

const user = useUserStore();
let input = ref("");
let targetUser = ref();
let pending = ref(false);
let friendWith = ref(false);
let inputBorder = ref("none");

function onClickSearch() {
  targetUser.value = null;
  pending.value = false;
  friendWith.value = false;
  inputBorder.value = "none";

  console.log(input.value);
  axios
    .get("http://localhost:3000/api/users/info/" + input.value)
    .then((response) => {
      console.log(response);
      if (response.data) {
        targetUser.value = response.data;
        if (
          Number(targetUser.value.id) === user.id ||
          targetUser.value.friendWith.includes(user.id)
        )
          friendWith.value = true;
        else if (targetUser.value.friendPendingReqFrom.includes(user.id))
          pending.value = true;
      } else {
        inputBorder.value = "4px solid red";
        input.value = "";
      }
    })
    .catch((error) => {
      console.log(error);
      inputBorder.value = "4px solid red";
      input.value = "";
    });
}

function onSend() {
  const data = {
    from: user.id,
    to: targetUser.value.id,
  };
  socket.emit("request_friendship", data);
  axios
    .post("http://localhost:3000/api/users/friends/add", {
      id1: user.id,
      id2: targetUser.value.id,
    })
    .then(function (response) {
      console.log(response);
      pending.value = true;
    })
    .catch(function (error) {
      console.log(error);
    });
}

function onCancel() {
  axios
    .post("http://localhost:3000/api/users/friends/ignore", {
      id1: user.id,
      id2: targetUser.value.id,
    })
    .then(function (response) {
      console.log(response);
      pending.value = false;
    })
    .catch(function (error) {
      console.log(error);
    });
}

defineExpose(
  defineComponent({
    name: "AddFriend",
  })
);
</script>

<style scoped>
.avatar-frame {
  display: inline-block;
  border-radius: 20%;
  background-position: center;
  background-size: cover;
  min-width: 50px;
  height: 50px;
  align-self: center;
  margin: 7%;
}

#search-form {
  display: flex;
}

#search-input {
  height: fit-content;
  width: fit-content;
  margin: 1em;
  font-size: 22px;
}

#search-button {
  margin: 10px;
  padding: 0;
}

#search-result {
  display: flex;
  align-items: center;
  width: 88%;
  margin: 20px auto 20px auto;
  background-color: grey;
  border-radius: 10px;
}
.target-info {
  display: flex;
  align-items: center;
}
.buttons {
  margin-left: auto;
  margin-right: 1em;
  align-self: center;
  font-family: "Outfit";
  font-size: 18px;
  border-radius: 12px;
  padding: 0.2em 1em 0.2em 1em;
  border: none;
}
.buttons:enabled {
  color: white;
  background-color: var(--main-color);
}

.buttons:enabled:hover {
  cursor: pointer;
  transform: scale(1.1, 1.1);
}
</style>
