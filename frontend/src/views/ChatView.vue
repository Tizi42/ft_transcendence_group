<template>
  <div class="chatPage">
    <h1>This is the CHAT page</h1>
    <MessagesView></MessagesView>
  </div>
</template>

<script lang="ts" setup>
import MessagesView from "./MessagesView.vue";
</script>

<style>
.chatPage {
  background: linear-gradient(
    116.6deg,
    #005f3e -20.9%,
    #feca00 99.99%,
    #ffda00 100%
  );
  height: 100vh;
  width: 100vw;
  padding-top: 2em;
  padding-bottom: 5em;
}
</style>
