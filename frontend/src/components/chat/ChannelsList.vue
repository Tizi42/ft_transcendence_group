<template>
  <div class="options-channel">
    <button id="create-new-channel" type="submit" @click="addNewChannel">
      <h3>create a new channel</h3>
      <img src="@/assets/icons/icon-add.png" alt="Create new channel" />
    </button>
  </div>
  <div
    id="list-all-channels"
    @click="getAllChannels"
    :class="{
      channelSelected: selectedChannel == -1,
      channelNotSelected: selectedChannel != -1,
    }"
  >
    <h3>All channels</h3>
  </div>
  <PendingChannelReq
    v-if="comingReq"
    @hideReq="hideReq"
    :channelToJoin="channelToJoin"
  />
  <ul class="list-my-channels">
    <li
      v-for="channel in myChannels"
      :key="channel"
      @click="getChannelMessages(channel.id)"
      :class="{
        channelSelected: selectedChannel == channel.id,
        channelNotSelected: selectedChannel != channel.id,
      }"
    >
      <img src="@/assets/icons/groupe.png" />
      <h3>{{ channel.name }}</h3>
    </li>
  </ul>
  <Teleport to="body">
    <ChannelBoxModal v-if="addWindow" @hide="hide">
      <AddChannelBox :user="user" />
    </ChannelBoxModal>
  </Teleport>
</template>

<script lang="ts" setup>
import {
  defineComponent,
  defineExpose,
  ref,
  Ref,
  defineEmits,
  defineProps,
  watch,
  onBeforeMount,
} from "vue";
import ChannelBoxModal from "./ChannelBox/ChannelBoxModal.vue";
import AddChannelBox from "./ChannelBox/AddChannelBox.vue";
import socket from "@/socket";
import { userInfoStore } from "@/stores/user";
import PendingChannelReq from "@/components/chat/PendingChannelReq.vue";
import { getUrlOf } from "@/router";

interface Props {
  selectedChannel: number;
  user: userInfoStore;
  myChannels: any;
}

const props: Readonly<Props> = defineProps<Props>();
const selectedChannel: Ref<number> = ref(props.selectedChannel);
const addWindow: Ref<boolean> = ref(false);
const history: Ref<any> = ref([]);
const channelToJoin: Ref<number> = ref(-1);
const comingReq: Ref<boolean> = ref(false);

socket.on("receive_pending_request", (request: boolean, channelId: number) => {
  comingReq.value = request;
  channelToJoin.value = channelId;
});

socket.on("receive_channel_created", () => {
  hide();
});

socket.on("exited_channel_list", () => {
  socket.emit("get_all_my_channels");
  getAllChannels();
});

onBeforeMount(async () => {
  socket.emit("get_all_my_channels");
});

watch(
  () => props.selectedChannel,
  (newSelectedChannel) => {
    selectedChannel.value = newSelectedChannel;
  }
);

const getAllChannels = () => {
  selectedChannel.value = -1;
  emit("getChannelSelected", selectedChannel.value);
};

const getChannelMessages = async (channelId: number) => {
  selectedChannel.value = channelId;
  history.value = [];
  emit("getChannelSelected", selectedChannel.value);
  await fetch(getUrlOf("api/chat/channelMessages/" + channelId), {
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
  emit("getHistory", history.value);
};

const addNewChannel = () => {
  console.log("add new channel");
  addWindow.value = true;
};

function hide() {
  addWindow.value = false;
}

function hideReq() {
  comingReq.value = false;
}

socket.on("receive_channel_message", () => {
  getChannelMessages(selectedChannel.value);
});

const emit = defineEmits(["getChannelSelected", "getHistory"]);

defineExpose(
  defineComponent({
    name: "ChannelsList",
  })
);
</script>
