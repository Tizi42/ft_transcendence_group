<template>
  <div class="historyTable">
    <div class="topBar">
      <div class="titleContainer">
        <div class="titleTab">{{ title }}</div>
      </div>
    </div>
    <div class="tableContainer">
      <div class="tableContent">
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
    </div>
  </div>
</template>

<script land="ts" setup>
import { defineComponent, defineExpose, defineProps } from "vue";

const props = defineProps(["title"]);
console.log(props);

defineExpose(
  defineComponent({
    name: "TableHistory",
  })
);
</script>

<style scoped>
.tableContainer {
  color: white;
  position: relative;
  display: block;
  overflow: scroll;
  background-image: url("../assets/tables/frame.svg");
  background-repeat: no-repeat;
  background-size: 80vw;
  width: 80vw;
  height: 22.22vw;
  margin: 0;
  z-index: 20;
}

.tableContent {
  padding-left: 30px;
  padding-right: 30px;
}

.titleContainer {
  z-index: 1;
  display: block;
  background-image: url("../assets/tables/title.svg");
  background-size: 200px;
  background-repeat: no-repeat;
  width: 200px;
  height: 50px;
  margin-left: -1px;
  padding-top: 1em;
  padding-left: 3em;
}

.titleTab {
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
  margin-left: 1px;
  margin-bottom: -20px;
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
