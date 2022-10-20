<template>
  <GameOverlay />
</template>

<script lang="ts" setup>
import { defineComponent, defineExpose } from "vue";
import GameOverlay from "./GameOverlay.vue";

defineExpose(
  defineComponent({
    name: "PlayGame",
  })
);
</script>
