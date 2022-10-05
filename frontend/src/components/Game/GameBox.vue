<template>
  <div class="gameBox">Game Box</div>
</template>

<script lang="ts" setup>
import { defineComponent, defineExpose } from "vue";

defineExpose(
  defineComponent({
    name: "GameBox",
  })
);
</script>

<style scoped>
.gameBox {
  width: 70%;
  height: 70%;
  background: #1e2b02;
  border: 5px solid #ffcb00;
  border-radius: 22px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
</style>
