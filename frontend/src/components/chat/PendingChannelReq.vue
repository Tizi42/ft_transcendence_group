<template>
  <div class="notification">
    <div class="notif-name">
      The channel
      <span>{{ channelToJoin.name }}</span>
      wants to invite you!
    </div>
    <div class="handle-notif">
      <button>
        <img
          @click="handleInvitationRequest('acceptJoin')"
          src="@/assets/icons/check.svg"
          class="img-accept"
        />
      </button>
      <button>
        <img
          @click="handleInvitationRequest('refuseJoin')"
          src="@/assets/icons/leave.png"
          class="img-ignore"
        />
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getUrlOf } from "@/router";
import socket from "@/socket";
import { useUserStore } from "@/stores/user";
import { Channel } from "@backend/channel/entities/channel.entity";
import { StoreGeneric } from "pinia";
import { defineComponent, defineExpose, defineProps } from "vue";

interface Props {
  channelToJoin: Channel;
}

const user: StoreGeneric = useUserStore();
const props: Readonly<Props> = defineProps<Props>();

const handleInvitationRequest = async (action: string) => {
  const dataToEmit = {
    from: props.channelToJoin.id,
    to: user.id,
  };
  await fetch(getUrlOf("api/channel/" + action), {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      channelId: props.channelToJoin.id,
      targetId: user.id,
    }),
  })
    .then((response: Response) => {
      return response.json();
    })
    .then((data) => {
      console.log("handle invitation data = ", data);
      if (data === "password_error" || data === "ban_error") {
        console.log("user banned by this channel");
      } else if (action === "acceptJoin") {
        socket.emit("accept_join_request", dataToEmit);
      } else {
        socket.emit("update_join_request", dataToEmit);
      }
    })
    .catch((error: Error) => {
      console.log("error : ", error);
    });
};

defineExpose(
  defineComponent({
    name: "PendingChannelReq",
  })
);
</script>

<style scoped>
.notification {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.notif-name span {
  font-weight: bold;
}

.handle-notif {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
}

.handle-notif button {
  background-color: #1e2b02;
  border: none;
  cursor: pointer;
  transition: transform 0.5s ease;
  margin-bottom: 5px;
}

.handle-notif button:hover {
  transform: scale(1.1, 1.1);
}

.img-accept {
  width: 25px;
}

.img-ignore {
  width: 35px;
}
</style>
