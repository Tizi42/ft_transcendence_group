<template>
  <div class="timer">
    <img src="../../assets/icons/clock_grey.svg" class="clock" />
    {{ timer[0] }}:{{ timer[1] }}
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, defineExpose, onBeforeMount } from "vue";
import { Ref, ref, defineProps, onBeforeUnmount } from "vue";
import socket from "@/socket";

interface Props {
  mode: string;
}

const props: Readonly<Props> = defineProps<Props>();
const timer: Ref<Array<string>> = ref(["00", "00"]);
const stop = ref(false);
const time = ref(new Date());
const watch_diff = ref(0);

function updateTimer() {
  const curTime = new Date();
  let milliDiff = curTime.getTime() - time.value.getTime() + watch_diff.value;
  if (props.mode == "speed") milliDiff = 180000 - milliDiff;
  if (milliDiff < 0) {
    timer.value[0] = "00";
    timer.value[1] = "00";
  } else {
    let minutes = Math.floor(milliDiff / 60000);
    let seconds = Math.floor(milliDiff / 1000) - 60 * minutes;
    timer.value[0] = (minutes < 10 ? "0" : "") + minutes.toString();
    timer.value[1] = (seconds < 10 ? "0" : "") + seconds.toString();
  }
  if (!stop.value) {
    setTimeout(() => {
      updateTimer();
    }, 100);
  }
}

onBeforeUnmount(() => {
  socket.off("game_start");
  socket.off("end");
  socket.off("time_reset");
  socket.off("current_game_time");
});

onBeforeMount(() => {
  if (props.mode == "speed") {
    timer.value = ["03", "00"];
  }

  socket.on("game_start", () => {
    time.value = new Date();
    stop.value = false;
    updateTimer();
  });

  socket.on("end", () => {
    stop.value = true;
    watch_diff.value = 0;
  });

  socket.on("time_reset", () => {
    if (props.mode == "speed") {
      timer.value = ["03", "00"];
    } else {
      timer.value = ["00", "00"];
    }
  });

  //for watch mode
  socket.on("current_game_time", (time_diff: number) => {
    console.log("gametime: ", time_diff);
    time.value = new Date();
    watch_diff.value = time_diff;
    stop.value = false;
    updateTimer();
  });
});

defineExpose(
  defineComponent({
    name: "TimerStart",
  })
);
</script>

<style scoped>
.timer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-family: Arial, Helvetica, sans-serif;
  color: #bebebe;
  font-size: 18px;
}

.clock {
  width: 20px;
  height: 20px;
}
</style>
