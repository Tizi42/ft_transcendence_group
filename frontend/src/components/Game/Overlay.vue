<template>
  <div>Overlay</div>
</template>

<script lang="ts" setup>
import { defineComponent, defineExpose } from "vue";

defineExpose(
  defineComponent({
    name: "PlayView",
  })
);
</script>
