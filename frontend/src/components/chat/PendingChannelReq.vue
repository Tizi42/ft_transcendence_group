<template>
  <div class="notification">
    <ul class="list-my-channels">
      <li v-for="pending in myRequests" :key="pending">
        {{ pending.user.name }} is waiting for your agreement
        <button>
          <img
            @click="acceptRequest(pending.user.id)"
            src="@/assets/icons/check.svg"
          />
        </button>
        <button>
          <img
            @click="refuseRequest(pending.user.id)"
            src="@/assets/icons/leave.png"
          />
        </button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import socket from "@/socket";
import { defineComponent, defineExpose, defineEmits, defineProps } from "vue";

interface Props {
  channelToJoin: number;
}

const props: Readonly<Props> = defineProps<Props>();

const acceptRequest = (reqFrom: number) => {
  const data = {
    channel: props.channelToJoin,
    user: reqFrom,
  };
  socket.emit("accept_join_request", data);
  emit("hideReq");
};

const refuseRequest = (reqFrom: number) => {
  const data = {
    channel: props.channelToJoin,
    user: reqFrom,
  };
  socket.emit("refuse_join_request", data);
  emit("hideReq");
};

const emit = defineEmits(["hideReq"]);

defineExpose(
  defineComponent({
    name: "PendingChannelReq",
  })
);
</script>
