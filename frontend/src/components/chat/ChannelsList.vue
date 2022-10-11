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
      channelSelected: selectedChannel == -1,
      channelNotSelected: selectedChannel != -1,
    }"
  >
    <h3>All channels</h3>
  </div>
  <ul class="list-my-channels">
    <li
      @click="getChannelMessages(0)"
      :class="{
        channelSelected: selectedChannel == 0,
        channelNotSelected: selectedChannel != 0,
      }"
    >
      <img src="@/assets/icons/groupe.png" />
      <h3>my first channel</h3>
    </li>
    <li
      @click="getChannelMessages(1)"
      :class="{
        channelSelected: selectedChannel == 1,
        channelNotSelected: selectedChannel != 1,
      }"
    >
      <img src="@/assets/icons/groupe.png" />
      <h3>random</h3>
    </li>
    <li
      @click="getChannelMessages(2)"
      :class="{
        channelSelected: selectedChannel == 2,
        channelNotSelected: selectedChannel != 2,
      }"
    >
      <img src="@/assets/icons/groupe.png" />
      <h3>apt 42</h3>
    </li>
    <li
      @click="getChannelMessages(3)"
      :class="{
        channelSelected: selectedChannel == 3,
        channelNotSelected: selectedChannel != 3,
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
const selectedChannel: Ref<number> = ref(-1);

const getAllChannels = () => {
  selectedChannel.value = -1;
  emit("getChannelSelected", selectedChannel.value);
};

const getChannelMessages = (channelId: number) => {
  selectedChannel.value = channelId;
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
