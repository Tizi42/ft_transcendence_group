<template>
  <form class="search-in-my-channels" @submit.prevent="onSubmit">
    <div id="div-search-all-channels">
      <input
        class="input-search-channels"
        id="input-search-all-channels"
        type="text"
        placeholder="Search all channels..."
      />
      <button type="submit">
        <img src="@/assets/icons/search.svg" />
      </button>
    </div>
  </form>
  <ul class="all-channels">
    <li
      class="channel-attributes"
      v-for="channel in allChannels"
      :key="channel"
    >
      <h3>{{ channel.name }}</h3>
      <div class="buttons-channel">
        <button
          v-if="!isntMember"
          type="submit"
          class="join-channel"
          @click="toJoin(channel)"
        >
          <h3>Join</h3>
        </button>
        <button
          type="submit"
          class="message-channel icon-image"
          @click="setSelectedChannel(channel.id)"
        ></button>
      </div>
    </li>
  </ul>
  <Teleport to="body">
    <ChannelBoxModal v-if="addWindow" @hide="hide">
      <JoinChannelBox
        :user="user"
        :channelJoined="channelJoined"
        @hideAddChannel="hide"
      />
    </ChannelBoxModal>
  </Teleport>
</template>

<script lang="ts" setup>
import ChannelBoxModal from "./ChannelBox/ChannelBoxModal.vue";
import JoinChannelBox from "./ChannelBox/JoinChannelBox.vue";
import socket from "@/socket";
import { userInfoStore } from "@/stores/user";
import {
  defineComponent,
  defineExpose,
  Ref,
  ref,
  defineEmits,
  onBeforeMount,
  defineProps,
} from "vue";

interface Props {
  user: userInfoStore;
}

const addWindow: Ref<boolean> = ref(false);
const selectedChannel: Ref<number> = ref(-1);
const allChannels: Ref<any> = ref([]);
const props: Readonly<Props> = defineProps<Props>();
const isntMember: Ref<boolean> = ref(true);
const channelJoined: Ref<any> = ref();

socket.emit("get_all_channels");
socket.on("receive_all_channels", (channels: any, notfound: boolean) => {
  allChannels.value = channels;
  isntMember.value = notfound;
});

onBeforeMount(async () => {
  console.log("user = ", props.user.id);
  console.log("members = ", isntMember.value);
});

const setSelectedChannel = (channelId: number) => {
  selectedChannel.value = channelId;
  emit("getChannelSelected", selectedChannel.value);
};

const toJoin = (channel: any) => {
  channelJoined.value = channel;
  addWindow.value = true;
  isntMember.value = false;
  // socket.emit("join_channel", channel.id);
  // socket.on("joined_channel", (channel: any) => {
  // emit("addChannelToList", channel);
  // console.log("joined :", channel);
  // });
};

function hide() {
  addWindow.value = false;
}

const emit = defineEmits(["getChannelSelected", "addChannelToList"]);

defineExpose(
  defineComponent({
    name: "allChannelsSelected",
  })
);
</script>
