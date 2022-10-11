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
  <ul class="list-channels">
    <li>my channels</li>
  </ul>
</template>

<script lang="ts" setup>
import { defineComponent, defineExpose, ref, Ref } from "vue";

const inputSearch: Ref<string> = ref("");

const onSubmit = () => {
  console.log("inputSearch = ", inputSearch);
};

defineExpose(
  defineComponent({
    name: "ChannelsList",
  })
);
</script>
