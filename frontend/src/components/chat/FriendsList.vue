<template>
  <ul class="list-friends">
    <li
      v-for="friend in user.friends"
      :key="friend"
      @click="getMessages(friend.id)"
    >
      <div class="avatar-frame">
        <img :src="friend.picture" />
      </div>
      <div class="friend-frame">
        <div v-if="friend.status === 'offline'" class="red-point"></div>
        <div v-if="friend.status === 'online'" class="green-point"></div>
        <h3>{{ friend.username }}</h3>
        <!-- <p>{{ lastMessage[profile] }}</p> -->
      </div>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { getUrlOf } from "./../../router";
import socket from "./../../socket";
import {
  defineComponent,
  onBeforeMount,
  ref,
  Ref,
  defineExpose,
} from "vue";

const receiver: Ref<number> = ref(-1);
const history: Ref<any> = ref([]);

const getMessages = async (id: number) => {
  receiver.value = id;
  history.value = [];
  await fetch(getUrlOf("api/chat/messages/" + id), {
    credentials: "include",
  })
    .then((response) => {
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

// function getAllDest(dest: any[]) {
//   for (let i = 0; i < dest.length; i++) {
//     if (dest[i].dest.id !== user.id) {
//       profileFrom.value.push(dest[i].dest);
//       getLastMessage(dest[i].dest.id);
//     }
//   }
//   receiver.value = profileFrom.value[profileFrom.value.length - 1];
// }

// function getLastMessage(id: number) {
//   socket.emit("last_from", id, (response: any) => {
//     lastMessage.value.push(response.content);
//   });
// }

onBeforeMount(() => {
  // await fetch(getUrlOf("api/chat/dest"))
  //   .then((response) => {
  //     return response.json();
  //   })
  //   .then((data) => {
  //     getAllDest(data);
  //   })
  //   .catch((err) => {
  //     console.error(err);
  //   });

  socket.on("receive_message", () => {
    getMessages(receiver.value);
  });
});

const emit = defineEmits(["selectReceiver", "getHistory"]);

interface Props {
  user: any;
}

defineProps<Props>();

defineExpose(
  defineComponent({
    name: "FriendsList",
  })
);
</script>
