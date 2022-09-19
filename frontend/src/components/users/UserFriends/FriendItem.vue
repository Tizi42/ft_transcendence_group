<template>
  <div class="friend-item">
    <div
      class="avatar-frame"
      ref="avatarFrame"
      :style="{
        'background-image': 'url(' + friend.picture + ')',
      }"
    ></div>
    <div class="info">
      <div class="name">{{ friend.displayName }}</div>
      <div class="status">
        <div class="status-rond" ref="statusRound"></div>
        <div class="status-text" ref="statusText">In game</div>
      </div>
    </div>
    <button
      class="friend-menu-button"
      @click="onClickFriend"
      v-text="buttonText"
    ></button>
    <FriendItemMenu
      v-if="show"
      :style="{ left: clickCoord.x + 'px', top: clickCoord.y + 'px' }"
      @hide="hide"
    />
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, defineExpose, defineProps, ref, computed } from "vue";
import { useUserStore } from "@/stores/user";
import FriendItemMenu from "./FriendItemMenu.vue";

const user = useUserStore();
const props = defineProps(["friend"]); //later: delete userstore and use this prop instead
console.log("friend:", props.friend);
const show = ref(false);
const buttonText = computed(() => (show.value === true ? "+" : "="));
const clickCoord = ref({
  x: 0,
  y: 0,
});

function onClickFriend(event: Event) {
  clickCoord.value.x = event.pageX - 100;
  clickCoord.value.y = event.pageY + 10;
  show.value = !show.value;
  console.log("click", show.value);
}

function hide() {
  show.value = false;
}

defineExpose(
  defineComponent({
    name: "FriendItem",
  })
);
</script>

<style scoped>
.friend-item {
  white-space: nowrap;
  display: flex;
  width: 100%;
  min-width: 260px;
  height: 110px;
  background-color: rgba(20, 29, 1, 1);
  border-radius: 12px;
}
.avatar-frame {
  margin-left: 0.5em;
  display: inline-block;
  border-radius: 100%;
  background-position: center;
  background-size: cover;
  min-width: 70px;
  height: 70px;
  align-self: center;
  margin-left: 7%;
  border: 1px solid #ffcb00;
}

.info {
  align-self: center;
  color: white;
  margin-left: 7%;
  font-family: "Outfit";
  text-align: left;
}

.name {
  font-weight: 500;
  font-size: 22px;
}

.status {
  margin-top: 0.4em;
  display: flex;
  align-items: center;
}

.status-text {
  font-weight: 300;
  font-size: 16px;
  margin-left: 5%;
  width: 6em;
}

.status-rond {
  border-radius: 100%;
  background-color: rgba(212, 57, 29, 1);
  min-width: 12px;
  height: 12px;
  margin-left: 5%;
}

.friend-menu-button {
  align-self: flex-start;
  color: #ffcb00;
  font-size: 26px;
  font-weight: 600;
  background: transparent;
  margin: 2% 5% 0 auto;
  border: none;
}
</style>
