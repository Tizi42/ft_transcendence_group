<template>
  <ul class="list-friends">
    <li
      v-for="friend in user.friends"
      :key="friend"
      @click="getMessages(friend.id)"
      :class="{
        selected: selectedFriend == friend.id,
        notSelected: selectedFriend != friend.id,
      }"
    >
      <div class="avatar-frame">
        <img :src="friend.picture" />
      </div>
      <div class="friend-frame">
        <div v-if="friend.status === 'offline'" class="grey-point"></div>
        <div v-if="friend.status === 'online'" class="green-point"></div>
        <div v-if="friend.status === 'in game'" class="red-point"></div>
        <h3>{{ friend.displayName }}</h3>
      </div>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { getUrlOf } from "@/router";
import socket from "@/socket";
import { Chat } from "@backend/chat/entities/chat.entity";
import { StoreGeneric } from "pinia";
import {
  defineComponent,
  onBeforeMount,
  ref,
  Ref,
  defineEmits,
  defineProps,
  defineExpose,
  onBeforeUnmount,
} from "vue";

interface Props {
  user: StoreGeneric;
}

defineProps<Props>();
const receiver: Ref<number> = ref(-1);
const history: Ref<Chat[]> = ref([]);
const selectedFriend: Ref<number> = ref(-1);

const getMessages = async (id: number) => {
  selectedFriend.value = id;
  receiver.value = id;
  history.value = [];
  await fetch(getUrlOf("api/chat/messages/" + id), {
    credentials: "include",
  })
    .then((response: Response) => {
      return response.json();
    })
    .then((data) => {
      history.value = data;
    })
    .catch((err) => {
      console.error(err);
    });
  emit("selectReceiver", id);
  emit("getHistory", history.value);
};

onBeforeMount(() => {
  socket.on("receive_message", () => {
    getMessages(receiver.value);
  });
});

onBeforeUnmount(() => {
  socket.off("receive_message");
});

const emit = defineEmits(["selectReceiver", "getHistory"]);

defineExpose(
  defineComponent({
    name: "FriendsList",
  })
);
</script>
