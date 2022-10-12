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
    <li class="channel-attributes">
<<<<<<< HEAD
      <h3>privated</h3>
=======
      <h3>my first channel</h3>
>>>>>>> master
      <div class="buttons-channel">
        <!-- <button type="submit" class="join-channel">
          <h3>Join</h3>
        </button> -->
<<<<<<< HEAD
        <button type="submit" class="message-channel icon-image"></button>
        <button type="submit" class="settings-channel icon-image"></button>
      </div>
    </li>
    <li class="channel-attributes">
      <h3>random</h3>
      <div class="buttons-channel">
        <button type="submit" class="join-channel">
          <h3>Join</h3>
        </button>
        <!-- <button type="submit" class="message-channel icon-image"></button> -->
        <!-- <button type="submit" class="settings-channel icon-image"></button> -->
=======
        <button
          type="submit"
          class="message-channel icon-image"
          @click="setSelectedChannel(0)"
        ></button>
>>>>>>> master
      </div>
    </li>
    <li class="channel-attributes">
      <h3>cats & dogs</h3>
      <div class="buttons-channel">
<<<<<<< HEAD
        <!-- <button type="submit" class="join-channel">
          <h3>Join</h3>
        </button> -->
        <button type="submit" class="message-channel icon-image"></button>
        <!-- <button type="submit" class="settings-channel icon-image"></button> -->
=======
        <button type="submit" class="join-channel">
          <h3>Join</h3>
        </button>
        <!-- <button
          type="submit"
          class="message-channel icon-image"
          @click="setSelectedChannel(0)"
        ></button> -->
      </div>
    </li>
    <li class="channel-attributes">
      <h3>random</h3>
      <div class="buttons-channel">
        <!-- <button type="submit" class="join-channel">
          <h3>Join</h3>
        </button> -->
        <button
          type="submit"
          class="message-channel icon-image"
          @click="setSelectedChannel(1)"
        ></button>
      </div>
    </li>
    <li class="channel-attributes">
      <h3>apt 42</h3>
      <div class="buttons-channel">
        <!-- <button type="submit" class="join-channel">
          <h3>Join</h3>
        </button> -->
        <button
          type="submit"
          class="message-channel icon-image"
          @click="setSelectedChannel(2)"
        ></button>
      </div>
    </li>
    <li class="channel-attributes">
      <h3>always win a pong</h3>
      <div class="buttons-channel">
        <!-- <button type="submit" class="join-channel">
          <h3>Join</h3>
        </button> -->
        <button
          type="submit"
          class="message-channel icon-image"
          @click="setSelectedChannel(3)"
        ></button>
>>>>>>> master
      </div>
    </li>
  </ul>
</template>

<script lang="ts" setup>
<<<<<<< HEAD
import { defineComponent, defineExpose } from "vue";
=======
import { defineComponent, defineExpose, Ref, ref, defineEmits } from "vue";

const selectedChannel: Ref<number> = ref(-1);

const setSelectedChannel = (channelId: number) => {
  selectedChannel.value = channelId;
  emit("getChannelSelected", selectedChannel.value);
};

const emit = defineEmits(["getChannelSelected"]);
>>>>>>> master

defineExpose(
  defineComponent({
    name: "allChannelsSelected",
  })
);
</script>
