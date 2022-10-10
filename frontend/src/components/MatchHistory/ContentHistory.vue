<template>
  <TransitionGroup name="list" tag="ul" v-if="show && !noMatch">
    <li v-for="battle in items" :key="battle.id">
      <MatchResult
        :match="battle"
        :pp1="getPictureUrl(battle.opponent1)"
        :pp2="getPictureUrl(battle.opponent2)"
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
import { Battle } from "@backend/battles/battle.entity";

//  variable
interface Props {
  battles: Array<Battle>;
  noMatch: boolean;
}

const props: Readonly<Props> = defineProps<Props>();
const items: Ref<Array<Battle>> = ref([]);
const show: Ref<boolean> = ref(false);

function getPictureUrl(id: number): string {
  return "http://localhost:3000/api/users/avatar/" + id.toString();
}

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
