<template>
  <div class="blocked-user-item">
    <div
      class="avatar-frame"
      :style="{
        'background-image': 'url(' + user.avatarUrl + ')',
      }"
    ></div>
    <div>
      <div class="name">{{ user.displayName }}</div>
      <div class="email">( {{ user.email }} )</div>
    </div>
    <img class="bin" src="@/assets/icons/bin.png" />
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, defineExpose, defineProps } from "vue";
import { useUserStore } from "@/stores/user";

const user = useUserStore();
const props = defineProps(["user"]); //later: delete userstore and use this prop instead

defineExpose(
  defineComponent({
    name: "BlockedUserItem",
  })
);
</script>

<style scoped>
.blocked-user-item {
  display: flex;
  width: 100%;
}
.avatar-frame {
  margin-left: 0.5em;
  display: inline-block;
  border-radius: 20%;
  background-position: center;
  background-size: cover;
  width: 50px;
  height: 50px;
}
.name,
.email {
  margin-left: 1em;
  font-family: "Outfit";
  font-weight: 400;
  font-size: 24px;
  color: rgba(255, 255, 255, 1);
  align-self: center;
  width: fit-content;
}

.email {
  font-family: "Outfit light";
  font-size: 20px;
  color: rgba(255, 255, 255, 1);
}

.bin {
  margin-right: 0.5em;
  margin-left: auto;
  height: 28px;
  width: 28px;
  align-self: center;
}

.bin:hover {
  cursor: pointer;
  transform: scale(1.1, 1.1);
}
</style>
