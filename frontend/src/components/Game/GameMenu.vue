<template>
  <div>
    <div class="page2FA">
      <div class="box boxMenu">
        <div class="gameMode">
          <div class="previousChoice" @click="changeMode(false)" />
          <Transition name="bounce">
            <div class="titleGame" v-if="show">
              {{ modeTitle[choosenMode] }}
            </div>
          </Transition>
          <div class="nextChoice" @click="changeMode(true)" />
        </div>
        <div class="description">
          <Transition name="fade">
            <div v-if="show">
              {{ modeDescription[choosenMode] }}
            </div>
          </Transition>
        </div>
        <div class="startBtn" @click="startGame">Start game</div>
      </div>
    </div>
    <teleport to="body" v-if="addWindow">
      <SimpleModal @hide="hide">
        <Transition name="bounce" appear>
          <div class="popUpContent" v-if="addWindow">
            <div class="popUpTxt">Finding your opponent...</div>
            <LoadingRing color="#ffcb00" size="50px" height="50px" />
            <div class="cancelBtn" @click="hide">Cancel</div>
          </div>
        </Transition>
      </SimpleModal>
    </teleport>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, defineExpose, onMounted, Ref } from "vue";
import { ref } from "vue";
import SimpleModal from "./SimpleModal.vue";
import "@/assets/styles/gameOverlay.css";
import LoadingRing from "../utils/LoadingRing.vue";
import router from "@/router";

const addWindow: Ref<boolean> = ref(false);
const show: Ref<boolean> = ref(false);
const choosenMode: Ref<number> = ref(0);
const numberModes = 3;
const modeTitle: Ref<Array<string>> = ref([
  "Normal mode",
  "Magic mode",
  "Speed mode",
]);
const modeDescription: Ref<Array<string>> = ref([
  "Classic pong : no magic power, just a simple ball and 10 points until victory.",
  "Pong with some magic powers : fireball, windball, super paddle, ...",
  "Classic pong except speed\nhas been increased.",
]);

//  change mode
async function changeMode(next: boolean) {
  show.value = false;
  if (next) {
    choosenMode.value = (choosenMode.value + 1) % numberModes;
  } else {
    choosenMode.value = (choosenMode.value + numberModes - 1) % numberModes;
  }
  setTimeout(() => {
    show.value = true;
  }, 500);
}

//  pop-up functions
function hide() {
  addWindow.value = false;
  console.log("cancel game");
}

async function startGame() {
  addWindow.value = true;
  console.log("start game");
  setTimeout(() => {
    router.push("pong");
  }, 4000);
}

onMounted(() => {
  show.value = true;
  window.addEventListener("keyup", (event) => {
    if (event.key == "Enter") {
      startGame();
    }
    if (event.key == "Escape") {
      hide();
    }
    if (event.key == "ArrowLeft" && !addWindow.value) {
      changeMode(false);
    }
    if (event.key == "ArrowRight" && !addWindow.value) {
      changeMode(true);
    }
  });
});

defineExpose(
  defineComponent({
    name: "GameMenu",
  })
);
</script>
