<template>
  <ul id="list-users">
    <li v-for="index in 10" :key="index">
      <BlockedUserItem />
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { defineComponent, defineExpose } from "vue";
import BlockedUserItem from "./BlockedUserItem.vue";

defineExpose(
  defineComponent({
    name: "BlockedUsers",
  })
);
</script>

<style scoped>
#list-users {
  margin: 36px 15% 48px 5%;
  padding-right: 2%;
  list-style: none;
}

li {
  display: flex;
  border-top: 1px solid rgba(59, 57, 57, 0.5);
  width: 100%;
  padding-top: 1em;
  padding-bottom: 1em;
  margin: 0;
}
</style>
