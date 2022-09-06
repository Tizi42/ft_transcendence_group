<template>
  <div class="historyTable">
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

const props = defineProps(["title", "ready", "battles"]);
console.log(props);

defineExpose(
  defineComponent({
    name: "TableHistory",
  })
);
</script>

<style scoped>
.loading {
  display: flex;
  align-items: center;
}

.tableContainer {
  color: white;
  position: relative;
  display: flex;
  justify-content: center;
  overflow: scroll;
  background-image: url("@/assets/icons/tables/frame.svg");
  background-repeat: no-repeat;
  background-size: 70vw 30vh;
  width: 70vw;
  height: 30vh;
  margin: 0;
  z-index: 20;
  scrollbar-color: dark;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.tableContainer::-webkit-scrollbar {
  display: none;
}

.titleContainer {
  z-index: 1;
  display: flex;
  background-image: url("@/assets/icons/tables/title.svg");
  background-size: 176px 44px;
  background-repeat: no-repeat;
  width: 176px;
  height: 44px;
  align-items: center;
  justify-content: center;
  font-size: 19px;
  transition: font-size 0.5s ease;
}

.titleTab {
  padding-right: 10px;
  z-index: 2;
  position: absolute;
  font-family: "Outfit Bold";
  font-style: normal;
  font-weight: 700;
  line-height: 18px;
  color: var(--main-color);
}

.titleContainer:hover {
  font-size: 21px;
}

.historyTable {
  width: 100%;
  align: left;
  text-align: left;
  margin: 0;
  margin-bottom: 3em;
}

.topBar {
  z-index: 1;
  width: 95%;
  display: flex;
}

.titleFrame {
  margin-right: 30%;
}

.topBar img {
  width: 13%;
}

.frame {
  width: 100%;
  margin: 0;
}
</style>
