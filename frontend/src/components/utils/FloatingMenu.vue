<template>
  <div @click="toggleMenu()">
    <slot name="button"></slot>
  </div>
  <div class="menuBox" v-if="show">
    <slot name="choices"></slot>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, defineExpose, Ref, ref } from "vue";

// variables
const show: Ref<boolean> = ref(false);

function toggleMenu() {
  show.value = !show.value;
}

defineExpose(
  defineComponent({
    name: "FloatingMenu",
  })
);
</script>

<style scoped>
.menuBox {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
</style>
