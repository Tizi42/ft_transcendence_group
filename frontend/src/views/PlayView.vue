<template>
  <div class="container">
    <h1 class="p-3 text-center">Play</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "PlayView",
});
</script>

<style>
h1 {
  color: white;
}

nav a.router-link-active {
  background-color: rgba(1, 71, 47, 1);
  height: 200px;
}
</style>
