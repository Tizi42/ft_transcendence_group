<template>
  <div class="modal-back">
    <div class="modal-container" ref="modal">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineComponent, defineExpose, defineEmits } from "vue";
import { useClickOutside } from "@/composables/useClickOutside";

const emit = defineEmits(["hide"]);
const modal = ref();

useClickOutside(modal, () => {
  emit("hide");
});

defineExpose(
  defineComponent({
    name: "FriendItem",
  })
);
</script>

<style scoped>
.modal-back {
  width: 2000px;
  height: 2000px;
  position: fixed;
  z-index: 999;
  top: 0%;
  left: 0%;
  background-color: rgba(38, 53, 48, 0.5);
}
.modal-container {
  font-size: 26px;
  position: fixed;
  z-index: 999;
  top: 30%;
  left: 50%;
  margin-left: -200px;
  border-radius: 12px;
  min-width: 400px;
}
</style>
