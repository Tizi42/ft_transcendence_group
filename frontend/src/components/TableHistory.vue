<template>
  <div class="historyTable">
    <div class="topBar">
      <div class="test">
        <div class="titleTab">Global</div>
      </div>
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
.test {
  display: block;
  background-image: url("../assets/tables/title.svg");
  background-repeat: no-repeat;
  width: 200px;
  height: 50px;
  margin-left: -1px;
  padding-top: 1em;
  padding-left: 3em;
  color: white;
}

.titleTab {
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
}

.topBar {
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
