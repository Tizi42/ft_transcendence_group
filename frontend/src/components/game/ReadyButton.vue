<template>
  <div class="readyBtn">ReadyButton</div>
</template>

<script lang="ts" setup>
import { defineComponent, defineExpose } from "vue";

defineExpose(
  defineComponent({
    name: "ReadyButton",
  })
);
</script>

<style scoped>
.readyBtn {
  position: fixed;
  top: 10%;
  left: 10%;
}
</style>
