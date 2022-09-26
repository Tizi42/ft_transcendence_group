<template>
  <div class="tableContent">
    <TransitionGroup name="list" tag="ul">
      <li v-for="battle in items" :key="battle.id">
        <MatchResult v-if="show" :battle="battle" />
      </li>
    </TransitionGroup>
    <div v-if="noMatch">no match</div>
  </div>
</template>

<script lang="ts" setup>
//  imports
import { defineComponent, defineExpose, defineProps } from "vue";
import { onMounted, onUpdated } from "vue";
import { ref, Ref } from "vue";
import MatchResult from "./MatchResult.vue";
import { Battle } from "@backend/battles/battle.entity";

//  variable
interface Props {
  battles: Array<Battle>;
  noMatch: boolean;
}

const props: Readonly<Props> = defineProps<Props>();
const items: Ref<Array<Battle>> = ref([]);
const show: Ref<boolean> = ref(false);

//  usefull functions
async function reshowData() {
  show.value = false;
  items.value = [];
  for await (const [key, item] of props.battles.entries()) {
    setTimeout(() => {
      items.value.push(item);
    }, 200 * (key + 1));
  }
  show.value = true;
}

//  lifecycle hook
onMounted(async () => {
  await reshowData();
});

onUpdated(async () => {
  await reshowData();
});

//  expose component
defineExpose(
  defineComponent({
    name: "ContentHistory",
  })
);
</script>
