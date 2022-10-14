<template>
  <div class="options-channel">
    <form class="search-in-my-channels" @submit.prevent="onSubmit">
      <div id="div-search-my-channels">
        <input
          class="input-search-channels"
          id="input-search-my-channels"
          type="text"
          placeholder="Search..."
          v-model="inputSearch"
        />
        <button type="submit">
          <img src="@/assets/icons/search.svg" />
        </button>
      </div>
    </form>
    <img
      src="@/assets/icons/icon-add.png"
      alt="Create new channel"
      @click="addNewChannel"
    />
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
      <AddChannelBox />
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

interface Props {
  selectedChannel: number;
}

const props: Readonly<Props> = defineProps<Props>();
const inputSearch: Ref<string> = ref("");
const selectedChannel: Ref<number> = ref(props.selectedChannel);
const addWindow: Ref<boolean> = ref(false);
const myChannels: Ref<any> = ref([]);

onBeforeMount(async () => {
  socket.emit("getAllMyChannels");
  socket.on("receiveAllMyChannels", (channel: any) => {
    myChannels.value = channel;
    console.log("my channels :", myChannels.value);
  });
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

const getChannelMessages = (channelId: number) => {
  selectedChannel.value = channelId;
  emit("getChannelSelected", selectedChannel.value);
};

const addNewChannel = () => {
  console.log("add new channel");
  addWindow.value = true;
};

const onSubmit = () => {
  console.log("inputSearch = ", inputSearch);
};

function hide() {
  addWindow.value = false;
}

const emit = defineEmits(["getChannelSelected"]);

defineExpose(
  defineComponent({
    name: "ChannelsList",
  })
);
</script>
