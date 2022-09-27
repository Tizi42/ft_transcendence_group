<template>
  <div class="page2FA">
    <div class="box boxMenu">
      <div class="gameMode">
        <div class="previousChoice" />
        <div class="titleGame">Normal mode</div>
        <div class="nextChoice" />
      </div>
      <div class="description">
        Classic pong : no magic power, just a simple ball and 10 points until
        victory.
      </div>
      <div class="startBtn" @click="startGame">Start game</div>
    </div>
  </div>
  <teleport to="body">
    <SimpleModal v-if="addWindow" @hide="hide">
      <div class="popUpTxt">Finding your opponent...</div>
      <div class="cancelBtn" @click="hide">Cancel</div>
    </SimpleModal>
  </teleport>
</template>

<script lang="ts" setup>
import { defineComponent, defineExpose } from "vue";
import { ref } from "vue";
import SimpleModal from "./SimpleModal.vue";
import "@/assets/styles/gameOverlay.css";

const addWindow = ref(false);

function hide() {
  addWindow.value = false;
  console.log("cancel game");
}

function startGame() {
  addWindow.value = true;
  console.log("start game");
}

defineExpose(
  defineComponent({
    name: "GameMenu",
  })
);
</script>
