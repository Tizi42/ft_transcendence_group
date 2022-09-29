<template>
  <div class="menuContainer">
    <div @click="toggleMenu()">
      <slot name="button"></slot>
    </div>
    <Transition name="slide-bot">
      <div class="menuBox" v-if="show">
        <slot name="choices"></slot>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, defineExpose, Ref, ref } from "vue";
import { defineProps, withDefaults } from "vue";

interface Props {
  height?: string;
  width?: string;
  top?: string;
  right?: string;
  left?: string;
  bottom?: string;
  grid: string;
}

withDefaults(defineProps<Props>(), {
  height: "30vh",
  width: "17vw",
  top: "",
  right: "0px",
  left: "",
  bottom: "80px",
});
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
.menuContainer {
  position: relative;
}
.menuBox {
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: left;
  flex-wrap: wrap;
  position: absolute;
  top: v-bind(top);
  bottom: v-bind(bottom);
  left: v-bind(left);
  right: v-bind(right);
  height: v-bind(height);
  width: v-bind(width);
  background: #eeeeee;
  border-radius: 22px;
  overflow: scroll;
  scrollbar-width: none;
  box-shadow: var(--main-shadow);
  background: var(--main-revgradient-background);
  background: #668a25;
  border: solid 4px #1e2a02;
}
</style>
