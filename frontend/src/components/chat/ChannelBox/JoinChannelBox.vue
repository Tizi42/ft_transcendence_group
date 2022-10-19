<template>
  <div class="box-create-channel">
    <h2 v-if="channel.type === 'private'">Send a request ?</h2>
    <h2 v-else>Join this channel ?</h2>
    <div class="fields" v-if="channel.type === 'protected'">
      <label for="channel-password">Enter the password :</label>
      <input
        v-model="password"
        id="channel-password"
        type="text"
        placeholder="Password.."
        required="true"
        autofocus
        :style="{ border: inputBorder }"
      />
    </div>
    <button type="submit" id="add-channel-button" @click="toJoin()"></button>
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
  channelJoined: any;
}

const props: Readonly<Props> = defineProps<Props>();
const channel: Ref<any> = ref();
const password: Ref<string> = ref("");
const authorized: Ref<boolean> = ref(true);
let inputBorder = ref("none");

onBeforeMount(async () => {
  channel.value = props.channelJoined;
});

const toJoin = () => {
  inputBorder.value = "none";
  const data = {
    channel: channel.value.id,
    password: password,
  };
  socket.emit("join_channel", data);
  socket.on("joined_channel", (auth: boolean) => {
    authorized.value = auth;
  });
  if (!authorized.value) {
    inputBorder.value = "4px solid red";
    password.value = "";
  } else {
    if (channel.value.type === "private") {
      socket.emit("send_request", channel.value);
    }
    emit("hideAddChannel");
  }
};
const emit = defineEmits(["hideAddChannel"]);

defineExpose(
  defineComponent({
    name: "JoinChannelBox",
  })
);
</script>

<style scoped>
.box-create-channel {
  text-align: center;
}

h2 {
  color: #ffcb00;
  margin: 0;
  margin-top: 20px;
}

#create-channel {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  height: 30vh;
}

.fields {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
}

.fields input,
#channel-type {
  margin-left: 5px;
  font-size: 0.8em;
  border: none;
  border-radius: 10px;
  padding: 0.7em;
  background-color: #141817;
  transition: transform 0.5s ease;
}

#channel-type {
  color: #ffcb00;
  cursor: pointer;
}

.fields input {
  color: white;
}

.fields input:hover,
#channel-type:hover {
  transform: scale(1.03, 1.03);
}

.fields input:focus,
#channel-type:focus {
  outline: none;
}

#add-channel-button {
  width: 30px;
  height: 30px;
  border: none;
  background-color: #1e2b02;
  background-size: 30px 30px;
  background-repeat: no-repeat;
  background-image: url("@/assets/icons/icon-add.png");
  cursor: pointer;
  transition: transform 0.5s ease;
}

#add-channel-button:hover {
  transform: scale(1.1, 1.1);
}
</style>
