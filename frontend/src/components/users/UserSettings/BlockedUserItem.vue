<template>
  <div class="blocked-user-item" v-if="notRemoved">
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
    <img class="bin" src="@/assets/icons/bin.png" @click="onRemoveBlock" />
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, defineExpose, defineProps, defineEmits } from "vue";
import { useUserStore } from "@/stores/user";
import { Ref, ref } from "vue";
import axios from "axios";
import socket from "@/socket";
import { getUrlOf } from "@/router";
import { StoreGeneric } from "pinia";

const user: StoreGeneric = useUserStore();
const props = defineProps(["blocked"]);
const emit = defineEmits(["renew"]);
const notRemoved: Ref<boolean> = ref(true);

async function onRemoveBlock() {
  notRemoved.value = false;
  const data = {
    from: user.id.toString(),
    to: props.blocked.id.toString(),
  };
  axios
    .post(
      getUrlOf("api/users/block/rm/"),
      {
        id1: user.id,
        id2: props.blocked.id,
      },
      {
        withCredentials: true,
      }
    )
    .then(() => {
      emit("renew");
      socket.emit("update_friend", data);
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
