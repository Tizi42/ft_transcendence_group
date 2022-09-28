<template>
  <div class="overlayTopBar">TopBar</div>
</template>

<script lang="ts" setup>
import { defineComponent, defineExpose } from "vue";

defineExpose(
  defineComponent({
    name: "OverlayTopBar",
  })
);
</script>

<style scoped>
.overlayTopBar {
  width: 90%;
  height: 20%;
}
</style>
