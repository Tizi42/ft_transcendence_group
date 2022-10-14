<template>
  <div class="box-create-channel">
    <h2>Create a new channel</h2>
    <form id="create-channel" @submit.prevent="createNewChannel">
      <div class="fields">
        <label for="channel-name">Channel name :</label>
        <input
          id="channel-name"
          v-model="channelName"
          type="text"
          placeholder="Channel name.."
        />
      </div>
      <div class="fields">
        <label for="channel-type">Choose your channel privacy :</label>
        <select id="channel-type" name="privacy" v-model="channelType">
          <option v-bind:value="'public'">public</option>
          <option v-bind:value="'private'">private</option>
          <option v-bind:value="'protected'">protected</option>
        </select>
      </div>
      <div class="fields" v-if="channelType === 'protected'">
        <label for="channel-password">Set a password :</label>
        <input
          id="channel-password"
          v-model="channelPassword"
          type="text"
          placeholder="Your channel password.."
        />
      </div>
      <button type="submit" id="add-channel-button"></button>
    </form>
  </div>
</template>

<script lang="ts" setup>
import {
  ref,
  defineComponent,
  defineExpose,
  Ref,
  defineProps,
  defineEmits,
} from "vue";
import socket from "@/socket";
import { userInfoStore } from "@/stores/user";

interface Props {
  user: userInfoStore;
}

const channelName: Ref<string> = ref("");
const channelType: Ref<string> = ref("public");
const channelPassword: Ref<string> = ref("");
const props: Readonly<Props> = defineProps<Props>();

// watch(
// );

const createNewChannel = async () => {
  console.log("channel name = ", channelName.value);
  console.log("channel type = ", channelType.value);
  console.log("bah ?");
  const data = {
    type: channelType.value,
    name: channelName.value,
    members: [props.user],
    owner: props.user.id,
    admins: [props.user.id],
    password: channelPassword.value,
  };
  console.log("bah ?");
  socket.emit("create_channel", data);
  emit("hideAddChannel");
};

const emit = defineEmits(["hideAddChannel"]);

defineExpose(
  defineComponent({
    name: "AddChannelBox",
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
