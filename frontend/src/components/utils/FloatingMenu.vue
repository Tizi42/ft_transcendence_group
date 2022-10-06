<template>
  <div class="menuContainer" ref="menuRef">
    <div @click="toggleMenu()">
      <slot name="button"></slot>
    </div>
    <div v-if="show">
      <Transition name="slide-bot">
        <div class="menuBox">
          <slot name="choices"></slot>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useClickOutside } from "@/composables/useClickOutside";
import { defineComponent, defineExpose, onMounted, Ref, ref } from "vue";
import { defineProps, withDefaults, defineEmits } from "vue";

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
  width: "400px",
  top: "",
  right: "0px",
  left: "",
  bottom: "80px",
});

// variables
const menuRef = ref();
const show: Ref<boolean> = ref(false);

function toggleMenu() {
  show.value = !show.value;
}

function openMenu() {
  show.value = true;
}

function closeMenu() {
  show.value = false;
}

useClickOutside(menuRef, () => {
  closeMenu();
});

defineExpose(
  defineComponent({
    name: "FloatingMenu",
    methods: {
      toggleMenu,
      openMenu,
      closeMenu,
    },
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
  background: #00000077;
}

.menuBox::-webkit-scrollbar {
  display: none;
}
</style>
