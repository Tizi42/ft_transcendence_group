<template>
  <div class="mainTable">
    <div class="topBar">
      <div class="titleContainer">
        <div class="titleTab">{{ title }}</div>
      </div>
    </div>
    <div class="tableContainer">
      <ContentHistory :battles="battles" :noMatch="noMatch" v-if="ready" />
      <LoadingRing color="#ffcb00" size="64px" height="30vh" v-else />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Battle } from "./../../../backend/battles/battle.entity";
import { defineComponent } from "vue";
import ContentHistory from "./ContentHistory.vue";
import LoadingRing from "../utils/LoadingRing.vue";

interface Props {
  title: string;
  battles: Array<Battle>;
  ready: boolean;
  noMatch: boolean;
}

defineProps<Props>();

defineExpose(
  defineComponent({
    name: "TableHistory",
  })
);
</script>
