<template>
  <div>
    <div class="page2FA">
      <div class="box boxMenu">
        <div class="gameMode">
          <div class="previousChoice" @click="changeMode(false)" />
          <Transition name="bounce">
            <div class="titleGame" v-if="show">
              <img :src="modeIcons[choosenMode].toString()" class="modeIcon" />
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
        <div class="startBtn" @click="startGame" v-if="!waiting">
          Start game
        </div>
        <div v-else>
          <Transition name="bounce" appear>
            <div class="popUpContent">
              <div class="cancelBtn" @click="cancel">
                <LoadingRing color="#ffcb00" size="30px" height="30px" />
                Cancel
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  defineComponent,
  defineExpose,
  onBeforeMount,
  Ref,
  ref,
  onBeforeUnmount,
} from "vue";
import LoadingRing from "../utils/LoadingRing.vue";
import router from "@/router/index";
import socket from "@/socket";
import { useUserStore } from "@/stores/user";

const waiting: Ref<boolean> = ref(false);
const user = useUserStore();
const show: Ref<boolean> = ref(false);
const choosenMode: Ref<number> = ref(0);
const numberModes = 3;
const modeTitle: Ref<Array<string>> = ref([
  "Normal mode",
  "Magic mode",
  "Speed mode",
]);
const mode: Ref<Array<string>> = ref(["normal", "magic", "speed"]);
const modeDescription: Ref<Array<string>> = ref([
  "Classic pong : no magic power, just a simple ball and at least 11 points until victory.",
  "Pong with 6 magic powers to be discovered: fireball, shield wall, ying yang keys... You will get a random magic power every 5s. You can have atmost 2 powers.",
  "Double speed, double fun! \nPlayer who misses less balls within 3 minutes will win the game.",
]);
const modeIcons: Array<URL> = [
  new URL("../../assets/icons/gameMode/modeNormal.svg", import.meta.url),
  new URL("../../assets/icons/gameMode/modeMagic.svg", import.meta.url),
  new URL("../../assets/icons/gameMode/modeSpeed.svg", import.meta.url),
];

//  change mode
async function changeMode(next: boolean) {
  if (waiting.value) return;
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

//  game init/cancel
function cancel() {
  waiting.value = false;
  console.log("cancel game");
  socket.emit(
    "quit_queue",
    {
      mode: mode.value[choosenMode.value],
      user_id: user.id,
    },
    (data: string) => {
      console.log(data);
    }
  );
}

async function startGame() {
  waiting.value = true;
  socket.emit(
    "queue_register",
    {
      mode: mode.value[choosenMode.value],
      user_id: user.id,
    },
    (data: boolean) => {
      console.log(data);
      if (data) {
        window.alert("You are already in queue!");
        waiting.value = false;
      }
    }
  );
}

function handleMenu(event: KeyboardEvent) {
  if (router.currentRoute.value.fullPath == "/play") {
    if (event.key == "Enter") {
      startGame();
    }
    if (event.key == "Escape") {
      cancel();
    }
    if (event.key == "ArrowLeft" && !waiting.value) {
      changeMode(false);
    }
    if (event.key == "ArrowRight" && !waiting.value) {
      changeMode(true);
    }
  }
}

onBeforeMount(() => {
  socket.on("game_found", (data: string) => {
    router.push({ name: "pong", params: { room_name: data } });
  });
  show.value = true;
  window.addEventListener("keyup", handleMenu);
});

onBeforeUnmount(() => {
  socket.off("game_found");
  window.removeEventListener("keyup", handleMenu);
});

defineExpose(
  defineComponent({
    name: "GameMenu",
  })
);
</script>

<style scoped>
.modeIcon {
  height: 50px;
  width: 50px;
}
</style>
