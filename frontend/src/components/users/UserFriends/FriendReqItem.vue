<template>
  <div class="request-frame">
    <div class="info">
      <div class="message">
        <span class="name">{{ sender.displayName }}</span>
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

const user = useUserStore();
const props = defineProps(["sender"]);

function onHandleFriendRequest(action: string) {
  axios
    .post("http://localhost:3000/api/users/friends/" + action, {
      id1: props.sender.id,
      id2: user.id,
    })
    .then((response) => {
      user.doFetchPending();
      user.doFetchFriends();
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
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
  text-decoration: underline;
  color: rgba(255, 203, 0, 0.7);
}

.name:hover {
  cursor: pointer;
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
