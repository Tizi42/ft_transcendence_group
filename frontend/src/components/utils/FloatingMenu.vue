<template>
  <div class="menuContainer" ref="menuRef">
    <div @click="toggleMenu()" class="buttonMenu">
      <slot name="button"></slot>
    </div>
    <div>
      <Transition name="slide-bot">
        <div class="menuBox" v-show="show">
          <slot name="choices"></slot>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useClickOutside } from "@/composables/useClickOutside";
import {
  defineComponent,
  onBeforeMount,
  onBeforeUnmount,
  Ref,
  ref,
  defineExpose,
  defineProps,
  withDefaults,
} from "vue";

interface Props {
  height?: string;
  width?: string;
  top?: string;
  right?: string;
  left?: string;
  bottom?: string;
  background?: string;
  padding?: string;
  direction: string;
  canClick?: boolean;
  zindex?: number;
}

const props: Readonly<Props> = withDefaults(defineProps<Props>(), {
  height: "",
  width: "",
  top: "",
  right: "",
  left: "",
  bottom: "65px",
  padding: "",
  background: "",
  canClick: true,
  zindex: 980,
});

// variables
const menuRef = ref();
const show: Ref<boolean> = ref(false);

function getOpacity(): string {
  return show.value == true ? "0.2" : "1";
}

function toggleMenu() {
  if (props.canClick) show.value = !show.value;
}

function openMenu() {
  if (props.canClick) show.value = true;
}

function closeMenu() {
  if (props.canClick) show.value = false;
}

useClickOutside(menuRef, () => {
  closeMenu();
});

function handleEscape(event: KeyboardEvent) {
  if (event.key == "Escape") {
    closeMenu();
  }
}

onBeforeMount(() => {
  window.addEventListener("keyup", handleEscape);
});

onBeforeUnmount(() => {
  window.removeEventListener("keyup", handleEscape);
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
  flex-direction: v-bind(direction);
  justify-content: space-evenly;
  align-items: center;
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
  padding: v-bind(padding);
  scrollbar-width: none;
  box-shadow: var(--main-shadow);
  background: v-bind(background);
  z-index: v-bind(zindex);
}

.menuBox::-webkit-scrollbar {
  display: none;
}

.buttonMenu {
  opacity: v-bind(getOpacity());
  transition: all 0.3s ease-in-out;
}
</style>
