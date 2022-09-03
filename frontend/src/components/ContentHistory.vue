<template>
  <div class="tableContent">
    <TransitionGroup name="list" tag="ul">
      <li v-for="battle in items" :key="battle">
        <div class="match" v-if="show">
          <div class="date">{{ getDate(battle.date_start) }}</div>
          <div class="time">{{ getTime(battle.date_start) }}</div>
        </div>
      </li>
    </TransitionGroup>
  </div>
</template>

<script lang="ts" setup>
//  imports
import { defineComponent, defineExpose, defineProps } from "vue";
import { onMounted, onUpdated } from "vue";
import { ref } from "vue";

//  variables
const props = defineProps(["battles"]);
const items = ref([]);
const show = ref(false);

//  usefull functions
function getTime(fullDate): string {
  let splitted = fullDate.split("T")[1].split(":");
  return splitted[0] + ":" + splitted[1];
}

function getDate(fullDate): string {
  let splitted = fullDate.split("T")[0].split("-");
  return splitted[1] + "." + splitted[2];
}

async function reshowData() {
  for await (const [key, item] of props.battles.entries()) {
    setTimeout(() => {
      items.value.push(item);
    }, 200 * (key + 1));
  }
}

//  lifecycle hook
onMounted(async () => {
  show.value = false;
  await reshowData();
  show.value = true;
});

onUpdated(async () => {
  show.value = false;
  items.value = [];
  await reshowData();
  show.value = true;
});

//  expose component
defineExpose(
  defineComponent({
    name: "ContentHistory",
  })
);
</script>

<style scoped>
ul {
  margin: 0;
  padding: 0;
}

li {
  margin-top: 30px;
  margin-bottom: 30px;
}

.list-enter-active {
  transition: all 0.3s ease-out;
}

.list-leave-active {
  transition: all 0.3s ease-out;
}

.list-enter-from {
  transform: translateX(30px);
  opacity: 0;
}

.list-leave-to {
  opacity: 0;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
.match {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  width: 60vw;
}
</style>
