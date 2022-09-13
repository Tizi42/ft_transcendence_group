<template>
  <div class="about">
    <h1>This is the blocked users section</h1>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, defineExpose } from "vue";

defineExpose(
  defineComponent({
    name: "BlockedUsers",
  })
);
</script>
