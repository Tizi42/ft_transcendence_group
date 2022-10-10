<template>
  <NavBar />
  <div class="wrapper">
    <RouterView v-slot="{ Component }">
      <Transition name="slide-right">
        <!-- find a good one -->
        <component :is="Component" />
      </Transition>
    </RouterView>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from "@/stores/user";
import NavBar from "./components/NavBar.vue";

const user = useUserStore();
user.doFetch();
</script>

<style scoped>
.wrapper {
  z-index: 1;
  position: fixed;
  top: 0%;
  width: 100vw;
  height: 100vh;
  left: 0%;
  background: var(--main-gradient-background);
}
</style>
