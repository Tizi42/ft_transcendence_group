<template>
  <div class="friends-section">
    <div class="friends-buttons">
      <img
        class="icon-button"
        src="@/assets/icons/icon-add.png"
        alt="add button"
      />
      <img
        class="icon-button"
        src="@/assets/icons/icon-filter.png"
        alt="filter button"
      />
    </div>
    <div class="friends-grid">
      <FriendItem v-for="index in 12" :key="index" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, defineExpose, ref } from "vue";
import { useUserStore } from "@/stores/user";
import FriendItem from "./FriendItem.vue";

const user = useUserStore();

defineExpose(
  defineComponent({
    name: "UserFriends",
  })
);
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
  cursor: pointer;
  transform: scale(1.1, 1.1);
}

.friends-grid {
  max-height: 500px;
  overflow-y: scroll;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  width: 99%;
  grid-gap: 15px;
  margin-bottom: 50px;
}
</style>
