<template>
  <div class="historyTable">
    <div class="topBar">
      <img src="../assets/tables/title.svg" class="titleFrame" />
      <img src="../assets/tables/selectedTab.svg" class="tableTab" />
      <img src="../assets/tables/unselectedTab.svg" class="tableTab" />
      <img src="../assets/tables/unselectedTab.svg" class="tableTab" />
      <img src="../assets/tables/unselectedTab.svg" class="tableTab" />
    </div>
    <img src="../assets/tables/frame.svg" class="frame" />
  </div>
</template>

<script>
export default {
  name: "TableHistory",
};
</script>

<style scoped>
.historyTable {
  width: 80%;
  align: left;
  text-align: left;
  margin: 0;
}

.topBar {
  width: 95%;
  display: flex;
  margin-left: 1px;
  margin-bottom: -20px;
  justify-content: space-between;
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
