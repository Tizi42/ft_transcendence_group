<template>
  <div class="mainTable">
    <div class="tableSmallContainer">
      <SmallContentHistory :battles="battles" :noMatch="noMatch" v-if="ready" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, defineExpose, defineProps } from "vue";
import SmallContentHistory from "./SmallContentHistory.vue";
import { BattleShow } from "@backend/battles/utils/battle-show";

interface Props {
  battles: Array<BattleShow>;
  ready: boolean;
  noMatch: boolean;
}

defineProps<Props>();

defineExpose(
  defineComponent({
    name: "SmallTableHistory",
  })
);
</script>
