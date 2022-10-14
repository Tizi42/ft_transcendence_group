<template>
  <form class="search-in-my-channels" @submit.prevent="onSubmit">
    <div id="div-search-all-channels">
      <input
        class="input-search-channels"
        id="input-search-all-channels"
        type="text"
        placeholder="Search all channels..."
        v-model="inputSearch"
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
          v-if="channel.members[channel] !== user"
          type="submit"
          class="join-channel"
          @submit.prevent="toJoin"
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
</template>

<script lang="ts" setup>
import socket from "@/socket";
import { userInfoStore } from "@/stores/user";
import {
  defineComponent,
  defineExpose,
  Ref,
  ref,
  defineEmits,
  onBeforeMount,
} from "vue";

interface Props {
  user: userInfoStore;
}

const selectedChannel: Ref<number> = ref(-1);
const allChannels: Ref<any> = ref([]);
const props: Readonly<Props> = defineProps<Props>();

onBeforeMount(async () => {
  socket.emit("get_all_channels");
  socket.on("receive_all_channels", (channel: any) => {
    allChannels.value = channel;
  });
});

const setSelectedChannel = (channelId: number) => {
  selectedChannel.value = channelId;
  emit("getChannelSelected", selectedChannel.value);
};

const toJoin = () => {
  socket.emit("get_all_channels");
  socket.on("receive_all_channels", (channel: any) => {
    allChannels.value = channel;
  });
};

const emit = defineEmits(["getChannelSelected"]);

defineExpose(
  defineComponent({
    name: "allChannelsSelected",
  })
);
</script>
