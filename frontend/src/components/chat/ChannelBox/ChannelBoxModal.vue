<template>
  <div class="pageCenter">
    <div class="modalContainer" ref="modal">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineComponent, defineExpose, defineEmits } from "vue";
import { useClickOutside } from "@/composables/useClickOutside";

const modal = ref();

useClickOutside(modal, () => {
  emit("hide");
});

const emit = defineEmits(["hide"]);

defineExpose(
  defineComponent({
    name: "ChannelBoxModal",
  })
);
</script>

<style scoped>
.pageCenter {
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
  background-color: #ffffff44;
  font-family: "Outfit";
  font-size: 18px;
  gap: 15px;
  color: #ffffff;
}

.modalContainer {
  /* display: flex;
  align-items: center;
  text-align: center;
  justify-content: space-evenly;
  flex-direction: column; */
  gap: 15px;
  padding-top: 2em;
  padding-bottom: 2em;
  width: 60vw;
  background: rgba(30, 42, 2, 1);
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.75);
  border-radius: 58px;
  position: absolute;
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  height: 40vh;
}
</style>
