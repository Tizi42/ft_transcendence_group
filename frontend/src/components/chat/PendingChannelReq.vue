<template>
  <div class="notification">
    <div>The channel id {{ channelToJoin }} wants to invite you!</div>
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
import { defineComponent, defineExpose, defineEmits, defineProps } from "vue";

interface Props {
  channelToJoin: any;
}

const user = useUserStore();
const props: Readonly<Props> = defineProps<Props>();

const handleInvitationRequest = async (action: string) => {
  const dataToEmit = {
    from: props.channelToJoin,
    to: user.id,
  };
  await fetch(getUrlOf("api/channel/" + action), {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      channelId: props.channelToJoin,
      targetId: user.id,
    }),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log("hanlde invitation data = ", data);
      if (data === "password_error" || data === "ban_error") {
        console.log("user banned by this channel");
      } else if (action === "acceptJoin") {
        socket.emit("accept_join_request", dataToEmit);
      } else {
        socket.emit("update_join_request", dataToEmit);
      }
    })
    .catch((error) => {
      console.log("error : ", error);
    });
};

const emit = defineEmits(["hideReq"]);

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
