<template>
  <div class="blocked-user-item">
    <div
      class="avatar-frame"
      :style="{
        'background-image': 'url(' + blocked.picture + ')',
      }"
    ></div>
    <div>
      <div class="name">{{ blocked.displayName }}</div>
      <div class="email">( {{ blocked.email }} )</div>
    </div>
    <img class="bin" src="./../../../assets/icons/bin.png" @click="onRemoveBlock" />
  </div>
</template>

<script lang="ts" setup>
import { defineComponent } from "vue";
import { useUserStore } from "./../../../stores/user";
import axios from "axios";

const user = useUserStore();
const props = defineProps(["blocked"]);
const emit = defineEmits(["renew"]);

function onRemoveBlock() {
  axios
    .post("http://localhost:3000/api/users/block/rm/", {
      id1: user.id,
      id2: props.blocked.id,
    })
    .then((response) => {
      console.log(response);
      emit("renew");
    })
    .catch((error) => {
      console.log(error);
    });
  user.doFetch();
}

defineExpose(
  defineComponent({
    name: "BlockedUserItem",
  })
);
</script>

<style scoped>
.blocked-user-item {
  display: flex;
  width: 100%;
}
.avatar-frame {
  margin-left: 0.5em;
  display: inline-block;
  border-radius: 20%;
  background-position: center;
  background-size: cover;
  width: 50px;
  height: 50px;
}
.name,
.email {
  margin-left: 1em;
  font-family: "Outfit";
  font-weight: 400;
  font-size: 24px;
  color: rgba(255, 255, 255, 1);
  align-self: center;
  width: fit-content;
}

.email {
  font-family: "Outfit light";
  font-size: 20px;
  color: rgba(255, 255, 255, 1);
}

.bin {
  margin-right: 0.5em;
  margin-left: auto;
  height: 28px;
  width: 28px;
  align-self: center;
}

.bin:hover {
  cursor: pointer;
  transform: scale(1.1, 1.1);
}
</style>
