<template>
  <div class="mainTable">
    <div class="topBar">
      <div class="titleContainer">
        <div class="titleTab">{{ title }}</div>
      </div>
    </div>
    <div class="tableContainer">
      <ContentHistory :battles="battles" v-if="ready" />
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
import ContentHistory from "./ContentHistory.vue";

defineProps(["title", "ready", "battles"]);

defineExpose(
  defineComponent({
    name: "TableHistory",
  })
);
</script>
