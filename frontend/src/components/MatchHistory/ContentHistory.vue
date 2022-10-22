<template>
  <TransitionGroup name="list" tag="ul" v-if="show && !noMatch">
    <li v-for="battle in items" :key="battle.id">
      <MatchResult
        :match="battle"
        :pp1="battle.picture1"
        :pp2="battle.picture2"
      />
    </li>
  </TransitionGroup>
  <div class="nofriends v-center" v-if="noMatch">
    You never played our wonderful game &#128530;
  </div>
</template>

<script lang="ts" setup>
//  imports
import { defineComponent, defineExpose, defineProps } from "vue";
import { onMounted, ref, Ref } from "vue";
import MatchResult from "./MatchResult.vue";
import { BattleShow } from "@backend/battles/utils/battle-show";

//  variable
interface Props {
  battles: Array<BattleShow>;
  noMatch: boolean;
}

const props: Readonly<Props> = defineProps<Props>();
const items: Ref<Array<BattleShow>> = ref([]);
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

//  expose component
defineExpose(
  defineComponent({
    name: "ContentHistory",
  })
);
</script>
