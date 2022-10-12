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
      <h3>privated</h3>
      <div class="buttons-channel">
        <!-- <button type="submit" class="join-channel">
          <h3>Join</h3>
        </button> -->
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
      </div>
    </li>
    <li class="channel-attributes">
      <h3>cats & dogs</h3>
      <div class="buttons-channel">
        <!-- <button type="submit" class="join-channel">
          <h3>Join</h3>
        </button> -->
        <button type="submit" class="message-channel icon-image"></button>
        <!-- <button type="submit" class="settings-channel icon-image"></button> -->
      </div>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { defineComponent, defineExpose } from "vue";

defineExpose(
  defineComponent({
    name: "allChannelsSelected",
  })
);
</script>
