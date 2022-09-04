<template>
  <div class="friends-section">
    <div class="friends-buttons">
      <img class="icon-button" src="@/assets/icon-add.png" alt="add" />
      <img class="icon-button" src="@/assets/icon-filter.png" alt="filter" />
    </div>
    <div class="friends-grid">
      <div>firends items</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "UserFriends",
});
</script>

<style scoped>
.friends-section {
  width: 86%;
  margin-left: 7%;
  margin-right: 7%;
}

.friends-buttons {
  text-align: right;
}

.icon-button {
  margin: 5px 15px 5px 5px;
  height: 24px;
  width: 24px;
  display: inline-block;
}

.icon-button:hover {
  opacity: 0.5;
  cursor: pointer;
}

.friends-grid {
  background-color: rgba(20, 29, 1, 1);
  height: 300px;
  overflow-y: scroll;
}
</style>
