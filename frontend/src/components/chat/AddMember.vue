<template>
  <form id="search-form-friend" @submit.prevent="onClickSearch">
    <input
      id="search-input"
      v-model="searchInput"
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
      :disabled="alreadyMember"
    >
      Send
    </button>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineComponent, defineExpose, defineProps, Ref } from "vue";
import { useUserStore } from "@/stores/user";
import socket from "@/socket";
import axios from "axios";
import { getUrlOf } from "@/router";

const user = useUserStore();
const searchInput: Ref<string> = ref("");
const targetUser = ref();
const pending = ref(false);
const alreadyMember = ref(false);
const inputBorder = ref("none");

interface Props {
  channel: any;
}

const props: Readonly<Props> = defineProps<Props>();

function onClickSearch() {
  targetUser.value = null;
  pending.value = false;
  alreadyMember.value = false;
  inputBorder.value = "none";

  console.log(searchInput.value);
  axios
    .get("http://localhost:3000/api/users/info/" + searchInput.value)
    .then((response) => {
      if (response.data) {
        targetUser.value = response.data;
        console.log("data =", targetUser.value);
        for (let i = 0; i < props.channel.members.length; i++) {
          if (props.channel.members[i].id === targetUser.value.id) {
            alreadyMember.value = true;
          }
        }
        if (Number(targetUser.value.id) === user.id) {
          alreadyMember.value = true;
        } else if (
          targetUser.value.memberPendingReqFrom.includes(props.channel.id)
        ) {
          pending.value = true;
        } else if (props.channel.banned.includes(targetUser.value.id)) {
          alreadyMember.value = true;
          inputBorder.value = "4px solid red";
          searchInput.value = "";
        }
      } else {
        inputBorder.value = "4px solid red";
        searchInput.value = "";
      }
    })
    .catch((error) => {
      console.log(error);
      inputBorder.value = "4px solid red";
      searchInput.value = "";
    });
}

async function onSend() {
  const dataToEmit = {
    from: props.channel.id,
    to: targetUser.value.id,
  };
  await fetch(getUrlOf("api/channel/addMember"), {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      channelId: props.channel.id,
      targetId: targetUser.value.id,
    }),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log("onSend data = ", data);
      if (data != "") {
        pending.value = true;
        socket.emit("update_join_request", dataToEmit);
      }
    })
    .catch((error) => {
      console.log("error : ", error);
    });
}

async function onCancel() {
  const dataToEmit = {
    from: props.channel.id,
    to: targetUser.value.id,
  };
  await fetch(getUrlOf("api/channel/ignoreMember"), {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      channelId: props.channel.id,
      targetId: targetUser.value.id,
    }),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log("onCancel data = ", data);
      if (data != "") {
        pending.value = false;
        socket.emit("update_join_request", dataToEmit);
      }
    })
    .catch((error) => {
      console.log("error : ", error);
    });
}

defineExpose(
  defineComponent({
    name: "AddMember",
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
  background: rgba(30, 42, 2, 0.7);
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
  background: #1e2a02;
  box-shadow: 0px 0px 4px 3px rgba(0, 0, 0, 0.25);
  border-radius: 22px;
  line-height: 2.3em;
  border: none;
  font-size: 24px;
  color: #ffffff;
  width: 40%;
  padding: 0em 1em;
  transition: transform 0.5s ease;
}

#search-button:hover {
  transform: scale(1.05, 1.05);
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
