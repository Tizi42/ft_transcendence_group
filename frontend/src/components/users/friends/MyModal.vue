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
  cursor: default;
  position: fixed;
  display: flex;
  align-items: center;
  flex-direction: column;
  z-index: 999;
  width: 100vw;
  height: 100vh;
  top: 0%;
  left: 0%;
  background-color: rgba(38, 53, 48, 0.5);
  font-family: "Outfit";
  font-size: 18px;
  gap: 15px;
  color: #ffffff;
}
.modal-container {
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: space-evenly;
  gap: 15px;
  flex-direction: column;
  padding-top: 2em;
  padding-bottom: 2em;
  width: 15vw;
  min-width: 200px;
  position: absolute;
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  height: fit-content;
}
</style>
