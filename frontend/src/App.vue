<template>
  <div class="nav-container">
    <nav id="navbar">
      <router-link :to="{ name: 'game' }">
        <div class="barTag">
          <img src="@/assets/icons/barTag.svg" alt="icon Bar Tag" />
        </div>
        <div class="link-container">
          <img src="@/assets/icons/pingpong.svg" alt="icon PingPong" />
        </div>
      </router-link>
      <router-link :to="{ name: 'chat' }">
        <div class="link-container">
          <img src="@/assets/icons/chat.svg" alt="icon Chat" />
        </div>
      </router-link>
      <router-link :to="{ name: 'user' }">
        <div class="link-container">
          <img src="@/assets/icons/profile.svg" alt="icon User" />
        </div>
      </router-link>
    </nav>
  </div>
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
