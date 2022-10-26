<template>
  <div class="addFriendContent">
    <form id="search-form-friend" @submit.prevent="onClickSearch">
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
      <button
        v-if="pending"
        id="cancel-button"
        class="buttons"
        @click="onCancel"
      >
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
  </div>
</template>

<script lang="ts" setup>
import { ref, defineComponent, defineExpose } from "vue";
import { useUserStore } from "@/stores/user";
import socket from "@/socket";
import axios from "axios";
import { getUrlOf } from "@/router";
import { StoreGeneric } from "pinia";

const user: StoreGeneric = useUserStore();
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
    .get(getUrlOf("api/users/info/") + input.value, {
      withCredentials: true,
    })
    .then((response: Response) => {
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
    .catch((error: Error) => {
      console.log(error);
      inputBorder.value = "4px solid red";
      input.value = "";
    });
}

async function onSend() {
  const data = {
    from: user.id.toString(),
    to: targetUser.value.id.toString(),
  };
  axios
    .post(
      getUrlOf("api/users/friends/add"),
      {
        id1: user.id,
        id2: targetUser.value.id,
      },
      {
        withCredentials: true,
      }
    )
    .then((response: Response) => {
      console.log("response = ", response);
      if (response.data != "") {
        pending.value = true;
        socket.emit("update_friend", data);
        socket.emit("request_friendship", data);
      } else {
        alert("Send friend request failed, please try again later...");
      }
    })
    .catch(function (error: Error) {
      console.log(error);
    });
}

async function onCancel() {
  const data = {
    from: user.id.toString(),
    to: targetUser.value.id.toString(),
  };
  axios
    .post(
      getUrlOf("api/users/friends/ignore"),
      {
        id1: user.id,
        id2: targetUser.value.id,
      },
      {
        withCredentials: true,
      }
    )
    .then((response: Response) => {
      console.log(response);
      pending.value = false;
      socket.emit("update_friend", data);
    })
    .catch(function (error: Error) {
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
.addFriendContent {
  display: flex;
  height: fit-content;
  width: fit-content;
  flex-direction: column;
  padding: 30px;
  background-color: #1e2a02;
  box-shadow: 0px 0px 4px 3px rgba(0, 0, 0, 0.25);
  border-radius: 22px;
  gap: 20px;
}

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

#search-form-friend {
  display: flex;
  gap: 20px;
  justify-content: space-between;
  align-items: center;
  height: fit-content;
  width: fit-content;
  min-width: 400px;
}

#search-input {
  font-size: 22px;
  outline: none;
  display: block;
  font-family: "Outfit";
  text-align: center;
  background: #141d01;
  box-shadow: inset 0px 0px 4px 3px rgba(0, 0, 0, 0.25);
  border-radius: 22px;
  border: none;
  font-size: 1em;
  line-height: 3.3em;
  width: 70%;
  color: #ffffff;
  transition: transform 0.5s ease;
}

#search-button {
  display: block;
  font-family: "Outfit Bold";
  background: #141d01;
  border-radius: 22px;
  line-height: 2.3em;
  border: none;
  font-size: 24px;
  color: #ffffff;
  width: 40%;
  padding: 0em 1em;
  transition: transform 0.5s ease;
  color: #bebebe;
}

#search-button:hover {
  transform: scale(1.05, 1.05);
  cursor: pointer;
}

#search-result {
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 400px;
  margin-top: 20px;
  margin-bottom: 20px;
  background-color: grey;
  border-radius: 10px;
}

.target-info {
  display: flex;
  align-items: center;
}

.target-name {
  min-width: 100%;
  text-align: left;
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
