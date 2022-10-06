<template>
  <GameMenu />
</template>

<script lang="ts" setup>
import { defineComponent, defineExpose } from "vue";
import GameMenu from "../components/game/GameMenu.vue";

defineExpose(
  defineComponent({
    name: "PlayView",
  })
);
</script>
