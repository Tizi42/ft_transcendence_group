<template>
  <div class="timer">{{ timer[0] }}:{{ timer[1] }}</div>
</template>

<script lang="ts" setup>
import { defineComponent, defineExpose, defineProps } from "vue";
import { onMounted, Ref, ref } from "vue";

interface Props {
  time: Date;
}

const props: Readonly<Props> = defineProps<Props>();
const timer: Ref<Array<string>> = ref(["00", "00"]);

function updateTimer() {
  const curTime = new Date();
  let milliDiff = curTime.getTime() - props.time.getTime();
  let minutes = Math.floor(milliDiff / 60000);
  let seconds = Math.floor(milliDiff / 1000) - 60 * minutes;
  timer.value[0] = (minutes < 10 ? "0" : "") + minutes.toString();
  timer.value[1] = (seconds < 10 ? "0" : "") + seconds.toString();
  setTimeout(() => {
    updateTimer();
  }, 100);
}

onMounted(() => {
  updateTimer();
});

defineExpose(
  defineComponent({
    name: "TimerStart",
  })
);
</script>

<style scoped>
.timer {
  font-family: Arial, Helvetica, sans-serif;
  color: #bebebe;
  font-size: 18px;
}
</style>
