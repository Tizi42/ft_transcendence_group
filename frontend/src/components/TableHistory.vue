<template>
  <div class="historyTable">
    <div class="topBar">
      <div class="titleContainer">
        <div class="titleTab">{{ title }}</div>
      </div>
    </div>
    <div class="tableContainer">
      <div class="tableContent" v-if="ready">
        Lorem Ipsum is simply dummy text of the grerbgbeb rebbr vrebbe erl whenn
        unknown printer took a galley of type and scrambled it to rboppo,pbo bro
        make a type specimen book. It has survived not only five centuries, ono
        but also the leap into electronic typesetting, remaining essential oponn
        unchanged. It was popularised in the 1960s with the release of ponponpol
        Letraset sheets containing Lorem Ipsum passages, and more recently nnn
        with desktop publishing software like Aldus PageMaker includingonononn
        unchanged. It was popularised in the 1960s with the release of ponponpol
        Letraset sheets containing Lorem Ipsum passages, and more recently nnn
        with desktop publishing software like Aldus PageMaker includingonononn
        unchanged. It was popularised in the 1960s with the release of ponponpol
        Letraset sheets containing Lorem Ipsum passages, and more recently nnn
        with desktop publishing software like Aldus PageMaker includingonononn
        unchanged. It was popularised in the 1960s with the release of ponponpol
        Letraset sheets containing Lorem Ipsum passages, and more recently nnn
        with desktop publishing software like Aldus PageMaker includingonononn
        unchanged. It was popularised in the 1960s with the release of ponponpol
        Letraset sheets containing Lorem Ipsum passages, and more recently nnn
        with desktop publishing software like Aldus PageMaker includingonononn
        unchanged. It was popularised in the 1960s with the release of ponponpol
        Letraset sheets containing Lorem Ipsum passages, and more recently nnn
        with desktop publishing software like Aldus PageMaker includingonononn
        unchanged. It was popularised in the 1960s with the release of ponponpol
        Letraset sheets containing Lorem Ipsum passages, and more recently nnn
        with desktop publishing software like Aldus PageMaker includingonononn
        unchanged. It was popularised in the 1960s with the release of ponponpol
        Letraset sheets containing Lorem Ipsum passages, and more recently nnn
        with desktop publishing software like Aldus PageMaker includingonononn
        unchanged. It was popularised in the 1960s with the release of ponponpon
        Letraset sheets containing Lorem Ipsum passages, and more recently nnn
        with desktop publishing software like Aldus PageMaker includingonononn
        unchanged. It was popularised in the 1960s with the release of ponponpon
        Letraset sheets containing Lorem Ipsum passages, and more recently nnn
        with desktop publishing software like Aldus PageMaker includingonononn
        unchanged. It was popularised in the 1960s with the release of ponponpon
        Letraset sheets containing Lorem Ipsum passages, and more recently nnn
        with desktop publishing software like Aldus PageMaker includingonononn
        unchanged. It was popularised in the 1960s with the release of ponponpon
        Letraset sheets containing Lorem Ipsum passages, and more recently nnn
        with desktop publishing software like Aldus PageMaker includingonononn
        unchanged. It was popularised in the 1960s with the release of ponponpon
        Letraset sheets containing Lorem Ipsum passages, and more recently nnn
        with desktop publishing software like Aldus PageMaker includingonononn
        unchanged. It was popularised in the 1960s with the release of ponponpon
        Letraset sheets containing Lorem Ipsum passages, and more recently nnn
        with desktop publishing software like Aldus PageMaker includingonononn
        unchanged. It was popularised in the 1960s with the release of ponponpon
        Letraset sheets containing Lorem Ipsum passages, and more recently nnn
        with desktop publishing software like Aldus PageMaker includingonononn
        versions of Lorem Ipsum.
      </div>
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

const props = defineProps(["title", "ready"]);
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
  background-image: url("../assets/tables/frame.svg");
  background-repeat: no-repeat;
  background-size: 70vw 30vh;
  width: 70vw;
  height: 30vh;
  margin: 0;
  z-index: 20;
  scrollbar-color: dark;
  scrollbar-width: none;
}

.tableContent {
  padding-left: 30px;
  padding-right: 30px;
}

.titleContainer {
  z-index: 1;
  display: flex;
  background-image: url("../assets/tables/title.svg");
  background-size: 176px 44px;
  background-repeat: no-repeat;
  width: 176px;
  height: 44px;
  align-items: center;
  justify-content: center;
}

.titleTab {
  margin-right: 1em;
  z-index: 2;
  position: absolute;
  font-family: "Outfit Bold";
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 18px;
  color: var(--main-color);
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
