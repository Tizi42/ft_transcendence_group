<template>
  <div class="box-create-channel">
    <h2 v-if="channel.type === 'private'">Send a request ?</h2>
    <h2 v-else>Join this channel ?</h2>
    <div class="fields-join" v-if="channel.type === 'protected'">
      <label for="channel-password-join">The password is required :</label>
      <input
        v-model="password"
        id="channel-password-join"
        type="password"
        placeholder="Channel password.."
        required="true"
        autofocus
        :style="{ border: inputBorder }"
      />
    </div>
    <button type="submit" class="join-channel" @click="toJoin()">
      <h3>Join</h3>
    </button>
  </div>
</template>

<script lang="ts" setup>
import {
  defineComponent,
  defineExpose,
  defineProps,
  onBeforeMount,
  defineEmits,
  ref,
  Ref,
} from "vue";
import socket from "@/socket";
import { userInfoStore } from "@/stores/user";

interface Props {
  user: userInfoStore;
  channel: any;
}

const props: Readonly<Props> = defineProps<Props>();
const password: Ref<string> = ref("");
let inputBorder = ref("none");

const toJoin = () => {
  inputBorder.value = "none";
  const data = {
    channelId: props.channel.id,
    password: password.value,
  };
  console.log("channel to join =>", props.channel.name);
  console.log("banned list =>", props.channel.banned);
  socket.emit("join_channel", data);
  password.value = "";
};

socket.on("joined_channel", (channelId: number) => {
  console.log("joined channel id ", channelId);
  socket.emit("get_all_channels");
  emit("hideAddChannel");
});

socket.on("password_error", () => {
  inputBorder.value = "4px solid red";
});

socket.on("ban_error", () => {
  emit("hideAddChannel");
  alert("You've been ban in this channel, you can't join it !");
});

// if (props.channel.value.type === "private") {
//   socket.emit("send_request", props.channel.value);
// }

const emit = defineEmits(["hideAddChannel"]);

defineExpose(
  defineComponent({
    name: "JoinChannelBox",
  })
);
</script>

<style scoped>
.box-create-channel {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  text-align: center;
  height: 100%;
}

h2 {
  color: #ffcb00;
  margin: 0;
  margin-top: 20px;
}

h3 {
  margin: 0;
}

.fields-join {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}

.fields-join input {
  margin-top: 10px;
  font-size: 0.8em;
  border: none;
  border-radius: 10px;
  padding: 0.7em;
  background-color: #141817;
  transition: transform 0.5s ease;
}

.fields-join input {
  color: white;
}

.fields-join input:hover {
  transform: scale(1.03, 1.03);
}

.fields-join input:focus {
  outline: none;
}

.join-channel {
  cursor: pointer;
  transition: transform 0.5s ease;
}

.join-channel:hover {
  transform: scale(1.1, 1.1);
}
</style>
