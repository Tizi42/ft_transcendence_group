<template>
  <form id="search-form" @submit.prevent="onClickSearch">
    <input
      id="search-input"
      v-model="input"
      type="text"
      placeholder="Search by user id"
      required="true"
      autofocus
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
      <div>{{ targetUser.displayName }}</div>
    </div>
    <button v-if="pending" id="cancel-button" class="buttons" @click="onCancel">
      Cancel
    </button>
    <button
      v-if="!pending && !friendWith"
      id="send-button"
      class="buttons"
      @click="onSend"
    >
      Send
    </button>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineComponent, defineExpose } from "vue";
import { useUserStore } from "@/stores/user";
import axios from "axios";

const user = useUserStore();
let input = ref("");
let targetUser = ref();
let pending = ref(false);
let friendWith = ref(false);

function onClickSearch() {
  targetUser.value = null;
  pending.value = false;
  friendWith.value = false;

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
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

function onSend() {
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

.target-info {
  display: flex;
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

#search-result {
  display: flex;
}
</style>
