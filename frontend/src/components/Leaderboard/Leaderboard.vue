<template>
  <div class="mainTable">
    <div class="topBar">
      <div class="titleContainer">
        <div class="titleTab">{{ title }}</div>
      </div>
      <div class="orderSelection">
        <div :class="getClassStyleOf(0)" @click="changeOrder(0)">
          <div class="nameTab">Points</div>
        </div>
        <div :class="getClassStyleOf(1)" @click="changeOrder(1)">
          <div class="nameTab">Win Rate</div>
        </div>
        <div :class="getClassStyleOf(2)" @click="changeOrder(2)">
          <div class="nameTab">Games Played</div>
        </div>
      </div>
    </div>
    <div class="tableContainer">
      <ContentLeaderboard :leaderboard="leaderboard" v-if="ready" />
      <div class="loading" v-else>
        <fulfilling-bouncing-circle-spinner
          :animation-duration="2000"
          :size="40"
          color="#ffcb00"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { FulfillingBouncingCircleSpinner } from "epic-spinners";
import { defineComponent, defineExpose, defineProps } from "vue";
import ContentLeaderboard from "./ContentLeaderboard.vue";
import { Ref, ref } from "vue";

const props = defineProps(["title", "ready", "leaderboard", "reorder"]);
const selectedOrder: Ref<number> = ref(1);
const cssClassTab: Ref<string[3]> = ref([
  "tabContainer",
  "selectedTabContainer",
  "tabContainer",
]);

function changeOrder(order: number) {
  props.reorder(order);
  selectedOrder.value = order;
  cssClassTab.value[0] = "tabContainer";
  cssClassTab.value[1] = "tabContainer";
  cssClassTab.value[2] = "tabContainer";
  cssClassTab.value[order] = "selectedTabContainer";
}

function getClassStyleOf(tab: number): string {
  return cssClassTab.value[tab];
}

defineExpose(
  defineComponent({
    name: "LeaderBoard",
  })
);
</script>
