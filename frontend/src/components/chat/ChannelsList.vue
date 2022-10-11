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
    <img src="@/assets/icons/icon-add.png" alt="Create new channel" />
  </div>
  <div
    id="list-all-channels"
    @click="getAllChannels"
    :class="{
      channelSelected: selectedChannel == 'all',
      channelNotSelected: selectedChannel != 'all',
    }"
  >
    <h3>All channels</h3>
  </div>
  <ul class="list-my-channels">
    <li
      @click="getChannelMessages('channel-1')"
      :class="{
        channelSelected: selectedChannel == 'channel-1',
        channelNotSelected: selectedChannel != 'channel-1',
      }"
    >
      <img src="@/assets/icons/groupe.png" />
      <h3>my first channel</h3>
    </li>
    <li
      @click="getChannelMessages('channel-2')"
      :class="{
        channelSelected: selectedChannel == 'channel-2',
        channelNotSelected: selectedChannel != 'channel-2',
      }"
    >
      <img src="@/assets/icons/groupe.png" />
      <h3>random</h3>
    </li>
    <li
      @click="getChannelMessages('channel-3')"
      :class="{
        channelSelected: selectedChannel == 'channel-3',
        channelNotSelected: selectedChannel != 'channel-3',
      }"
    >
      <img src="@/assets/icons/groupe.png" />
      <h3>apt 42</h3>
    </li>
    <li
      @click="getChannelMessages('channel-4')"
      :class="{
        channelSelected: selectedChannel == 'channel-4',
        channelNotSelected: selectedChannel != 'channel-4',
      }"
    >
      <img src="@/assets/icons/groupe.png" />
      <h3>always win a pong</h3>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { defineComponent, defineExpose, ref, Ref, defineEmits } from "vue";

const inputSearch: Ref<string> = ref("");
const selectedChannel: Ref<string> = ref("all");

const getAllChannels = () => {
  selectedChannel.value = "all";
  emit("getChannelSelected", selectedChannel.value);
};

const getChannelMessages = (channel: string) => {
  selectedChannel.value = channel;
  emit("getChannelSelected", selectedChannel.value);
};

const onSubmit = () => {
  console.log("inputSearch = ", inputSearch);
};

const emit = defineEmits(["getChannelSelected"]);

defineExpose(
  defineComponent({
    name: "ChannelsList",
  })
);
</script>
