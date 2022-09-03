<template>
  <div class="friends-section">
    <button>add</button>
    <button>filter</button>
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
.friends-grid {
  background-color: rgba(20, 29, 1, 1);
  height: 300px;
}
</style>
