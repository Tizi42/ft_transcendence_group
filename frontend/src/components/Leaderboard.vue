<template>
  <div class="thisTable">
    <div class="topBar">
      <div class="titleContainer">
        <div class="titleTabMain">{{ title }}</div>
      </div>
      <div class="tabContainer">
        <div class="titleTab">{{ title }}</div>
      </div>
      <div class="tabContainer">
        <div class="titleTab">{{ title }}</div>
      </div>
      <div class="tabContainer">
        <div class="titleTab">{{ title }}</div>
      </div>
      <div class="tabContainer">
        <div class="titleTab">{{ title }}</div>
      </div>
    </div>
    <div class="tableContainer">
      <div class="tableContent" v-if="ready">
        <TransitionGroup name="list" tag="ul">
          <li v-for="item in items" :key="item">
            {{ item.msg }}
          </li>
        </TransitionGroup>
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
import { onMounted } from "vue";
import { ref } from "vue";

const props = defineProps(["title", "ready"]);
const items = ref([]);
console.log(props);

onMounted(async () => {
  for (let i = 0; i < 9; i++) {
    setTimeout(() => {
      items.value.push({ msg: "Item" + i });
    }, 1200 + 200 * i);
  }
});

defineExpose(
  defineComponent({
    name: "LeaderBoard",
  })
);
</script>

<style scoped>
li {
  margin-top: 30px;
  margin-bottom: 30px;
}

.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
}

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
  -ms-overflow-style: none;
}

.tableContainer::-webkit-scrollbar {
  display: none;
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

.titleTabMain {
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

.thisTable {
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
