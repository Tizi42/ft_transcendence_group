<template>
  <div class="modal-container">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, defineExpose } from "vue";

defineExpose(
  defineComponent({
    name: "FriendItem",
  })
);
</script>

<style scoped>
.modal-container {
  font-size: 26px;
  background-color: grey;
  position: fixed;
  z-index: 999;
  top: 30%;
  left: 50%;
  width: 300px;
  margin-left: -150px;
}
</style>
