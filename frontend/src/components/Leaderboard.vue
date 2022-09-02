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
    <div class="test">
      <div class="title">Global</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LeaderBoard",
};
</script>

<style scoped>
.test {
  background-image: url("../assets/tables/title.svg");
  background-repeat: no-repeat;
  width: 13%;
  height: 13%;
  padding-top: 1em;
  padding-left: 3em;
  color: white;
}

.title {
  position: absolute;
  font-family: "Outfit Bold";
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 18px;
  color: var(--main-color);
}

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
