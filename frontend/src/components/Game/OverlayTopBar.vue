<template>
  <div class="overlayTopBar">
    <TimerStart :time="time" />
    <div class="infoBar" v-if="show">
      <div class="playerInfoLeft">
        <img :src="getPictureUrl(user.id)" class="profile" />
        <Transition name="bounce">
          <img
            v-if="emojiL > 0 && showEmoji"
            :src="getImgUrl(emojiArray[emojiL - 1])"
            class="emojiBoxShow"
          />
        </Transition>
        <UserChat
          :user="user"
          :message="messageL"
          :mine="true"
          transition="fadeGroup"
          align="flex-start"
        />
      </div>
      <div class="scores">
        <div class="scoreNb">{{ scores[0] }}</div>
        -
        <div class="scoreNb">{{ scores[1] }}</div>
      </div>
      <div class="playerInfoRight">
        <UserChat
          :user="opponent"
          :message="messageR"
          :mine="false"
          transition="fadeGroupR"
          align="flex-end"
        />
        <img :src="getPictureUrl(opponent.id)" class="profile" />
        <Transition name="bounce">
          <img
            v-if="emojiL > 0 && showEmoji"
            :src="getImgUrl(emojiArray[emojiL - 1])"
            class="emojiBoxShowR"
          />
        </Transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, defineExpose, defineProps, onUpdated } from "vue";
import { Ref, ref, onMounted } from "vue";
import { User } from "@backend/users/users.entity";
import { Chat } from "@backend/chat/entities/chat.entity";
import TimerStart from "../utils/TimerStart.vue";
import UserChat from "./UserChat.vue";

interface Props {
  user: User;
  opponent: User;
  time: Date;
  scores: Array<number>;
  messageL: Chat | null;
  messageR: Chat | null;
  emojiL: number;
  emojiR: number;
}

defineProps<Props>();
const show: Ref<boolean> = ref(false);
const showEmoji: Ref<boolean> = ref(false);
const emojiArray: Array<string> = [];

function getImgUrl(pic: string) {
  return require("../../assets/" + pic);
}

function loadEmojis() {
  for (var i = 1; i < 38; i++) {
    emojiArray.push("icons/emojis/" + i + ".svg");
  }
}

function getPictureUrl(id: number): string {
  return "http://localhost:3000/api/users/avatar/" + id.toString();
}

onMounted(() => {
  loadEmojis();
  show.value = true;
});

onUpdated(() => {
  showEmoji.value = true;
  setTimeout(() => {
    showEmoji.value = false;
  }, 3000);
});

defineExpose(
  defineComponent({
    name: "OverlayTopBar",
  })
);
</script>

<style scoped>
.emojiBoxShow {
  display: block;
  position: absolute;
  width: 50px;
  min-width: 50px;
  height: 50px;
  min-height: 50px;
  left: 50px;
  opacity: 1;
}

.emojiBoxShowR {
  display: block;
  position: absolute;
  width: 50px;
  min-width: 50px;
  height: 50px;
  min-height: 50px;
  right: 50px;
  opacity: 1;
}

.overlayTopBar {
  width: 70%;
  height: 15%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.infoBar {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.scores {
  width: 20%;
  font-size: 80px;
  color: var(--main-color);
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}

.scoreNb {
  width: 40%;
  text-align: center;
}

.playerInfoLeft,
.playerInfoRight {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 24px;
  color: #bebebe;
  gap: 30px;
  width: 40%;
}
.playerInfoLeft {
  justify-content: left;
  text-align: left;
}

.playerInfoRight {
  justify-content: right;
  text-align: right;
}

.profile {
  display: block;
  width: 80px;
  min-width: 80px;
  height: 80px;
  min-height: 80px;
  object-fit: cover;
  opacity: 1;
  transition: all 0.3s ease-out;
  outline: 5px solid rgba(0, 0, 0, 0.2);
}

.profile:hover {
  transform: scale(1.2);
}

.userBox {
  display: flex;
  flex-direction: column;
}
</style>
