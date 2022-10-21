<template>
  <ul class="list-my-channels">
    <li>
      is sending you a request to join
      <img @click="acceptRequest()" src="@/assets/icons/check.svg" />
      <img
        class="leave-img"
        @click="refuseRequest()"
        src="@/assets/icons/leave.png"
      />
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { getUrlOf } from "@/router";
import socket from "@/socket";
import {
  defineComponent,
  defineExpose,
  defineEmits,
  defineProps,
  Ref,
  ref,
  onBeforeMount,
} from "vue";

interface Props {
  channelToJoin: number;
  reqFrom: number;
}

const props: Readonly<Props> = defineProps<Props>();
const theChannel: Ref<any> = ref();
const theUser: Ref<any> = ref();

const acceptRequest = () => {
  const data = {
    channel: props.channelToJoin,
    // user: reqFrom,
  };
  // socket.emit("accept_join_request", data);
  // emit("hideReq");
};

const refuseRequest = () => {
  const data = {
    channel: props.channelToJoin,
    // user: reqFrom,
  };
  // socket.emit("refuse_join_request", data);
  emit("hideReq");
};

onBeforeMount(async () => {
  await fetch(getUrlOf("api/channel/", props.channelToJoin), {
    credentials: "include",
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      theChannel.value = data;
    })
    .catch((error) => {
      console.log("error :", error);
    });
  // for (let i = 0; i < theChannel.value.pending.length; i++) {
  //   if (theChannel.value.pending[i].id === props.reqFrom) {
  //     theUser.value = theChannel.value.pending[i];
  //   }
  // }
});

const emit = defineEmits(["hideReq"]);

defineExpose(
  defineComponent({
    name: "PendingChannelReq",
  })
);
</script>
