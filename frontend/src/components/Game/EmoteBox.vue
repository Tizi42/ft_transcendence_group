<template>
  <TransitionGroup name="fadeEmote">
    <div v-for="item in items" :key="item">
      <img
        :src="emojisURL[item - 1].toString()"
        :class="getClassStyle()"
        @load="onLoaded"
        v-show="show"
      />
    </div>
  </TransitionGroup>
</template>

<script lang="ts" setup>
import { defineComponent, defineExpose, defineProps, onMounted } from "vue";
import { Ref, ref, onUpdated } from "vue";

interface Props {
  emoji: number;
  emojisURL: Array<URL>;
  time: Date;
  side: string;
}

const props: Readonly<Props> = defineProps<Props>();
const items: Ref<Array<number>> = ref([]);
const lastUpdate: Ref<Date> = ref(new Date());
const show: Ref<boolean> = ref(false);

function onLoaded() {
  show.value = true;
}

function getClassStyle(): string {
  return props.side == "left" ? "emojiBoxShow" : "emojiBoxShowR";
}

function remove(item: number) {
  const i = items.value.indexOf(item);
  if (i > -1) {
    items.value.splice(i, 1);
  }
}

function updateEmoji(item: number) {
  items.value.push(item);
  setTimeout(() => {
    remove(item);
  }, 4000);
}

onUpdated(() => {
  let curDate = new Date();
  if (
    items.value.length > 0 &&
    curDate.getTime() - lastUpdate.value.getTime() < 1000
  ) {
    return;
  }
  lastUpdate.value = new Date();
  let emote = props.emoji;
  updateEmoji(emote);
});

onMounted(() => {
  lastUpdate.value = new Date();
});

defineExpose(
  defineComponent({
    name: "EmoteBox",
  })
);
</script>

<style scoped>
.emojiBoxShow,
.emojiBoxShowR {
  display: block;
  position: absolute;
  width: 50px;
  min-width: 50px;
  height: 50px;
  min-height: 50px;
  background: none;
  opacity: 1;
}

.emojiBoxShow {
  left: 50px;
}

.emojiBoxShowR {
  right: 50px;
}

.emojiBoxShow img,
.emojiBoxShowR img {
  position: relative;
}
</style>
