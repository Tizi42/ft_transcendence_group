<template>
  <ul class="list-channels">
    <li>channel</li>
  </ul>
</template>

<script lang="ts" setup>
import { defineComponent } from "vue";

defineExpose(
  defineComponent({
    name: "ChannelsList",
  })
);
</script>
