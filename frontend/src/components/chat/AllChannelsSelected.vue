<template>
  <div v-if="allChannels.length === 0" class="welcome-chat">
    <img src="@/assets/icons/multiBubble.svg" />
    <h1>Let's chat</h1>
  </div>
  <ul class="all-channels">
    <li
      class="channel-attributes"
      v-for="channel in allChannels"
      :key="channel.id"
    >
      <h3>{{ channel.name }}</h3>
      <div class="buttons-channel">
        <button
          v-if="!isMember(channel)"
          type="submit"
          class="join-channel"
          @click="toJoin(channel)"
        >
          <h3>Join</h3>
        </button>
        <button
          v-else
          type="submit"
          class="message-channel icon-image"
          @click="setSelectedChannel(channel.id)"
        ></button>
      </div>
    </li>
  </ul>
  <Teleport to="body">
    <JoinChannelBoxModal v-if="addWindow" @hide="hide">
      <JoinChannelBox
        v-if="channelJoined"
        :user="user"
        :channel="channelJoined"
        @hideAddChannel="hide"
      />
    </JoinChannelBoxModal>
  </Teleport>
</template>

<script lang="ts" setup>
import JoinChannelBoxModal from "./ChannelBox/JoinChannelBoxModal.vue";
import JoinChannelBox from "./ChannelBox/JoinChannelBox.vue";
import socket from "@/socket";
import {
  defineComponent,
  defineExpose,
  Ref,
  ref,
  defineEmits,
  onBeforeMount,
  defineProps,
  onBeforeUnmount,
} from "vue";
import { StoreGeneric } from "pinia";
import { Channel } from "@backend/channel/entities/channel.entity";

interface Props {
  user: StoreGeneric;
}

const addWindow: Ref<boolean> = ref(false);
const selectedChannel: Ref<number> = ref(-1);
const allChannels: Ref<Channel[]> = ref([]);
const props: Readonly<Props> = defineProps<Props>();
const channelJoined: Ref<Channel | null> = ref(null);

const setSelectedChannel = (channelId: number) => {
  selectedChannel.value = channelId;
  emit("getChannelSelected", selectedChannel.value);
};

function isMember(channel: Channel) {
  for (let i = 0; i < channel.members.length; i++) {
    if (channel.members[i].id === props.user.id) {
      return true;
    }
  }
  return false;
}

const toJoin = (channel: Channel) => {
  channelJoined.value = channel;
  addWindow.value = true;
};

function hide() {
  addWindow.value = false;
}

onBeforeMount(() => {
  socket.emit("get_all_channels");
  socket.on("receive_all_channels", (channels: Channel[]) => {
    allChannels.value = [];
    allChannels.value = channels;
  });
  socket.on("new_channel_created", () => {
    socket.emit("get_all_channels");
  });
});

onBeforeUnmount(() => {
  socket.off("receive_all_channels");
  socket.off("new_channel_created");
});

const emit = defineEmits(["getChannelSelected", "addChannelToList"]);

defineExpose(
  defineComponent({
    name: "allChannelsSelected",
  })
);
</script>
