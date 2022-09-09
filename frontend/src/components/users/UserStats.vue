<template>
  <div class="stats-section">
    <div class="stats-item">win rate graph</div>
    <div class="stats-item">
      <div>88%</div>
      <div>Win Rate</div>
    </div>
    <div class="stats-item">
      <div>2</div>
      <div>Rank</div>
    </div>
    <div class="stats-item">
      <div>402</div>
      <div>Matches</div>
    </div>
    <div class="stats-item">
      <div>Ping-Ping Master</div>
      <div>League</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "UserStats",
});
</script>

<style scoped>
.stats-section {
  width: 86%;
  margin-left: 7%;
  margin-right: 7%;
  background-color: rgba(20, 29, 1, 1);
  display: flex;
  align-items: center;
}

.stats-item {
  margin: 42px;
  font-family: "Outfit";
  font-style: normal;
  font-weight: light;
  font-size: 18px;
}
</style>
