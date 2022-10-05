<template>
  <div class="overlayTopBar">
    <TimerStart :time="time" />
    <div class="infoBar">
      <div class="playerInfoLeft">
        <img :src="getPictureUrl(user.id)" class="profile" />
        <UserChat
          :user="user"
          :message="messageL"
          transition="fadeGroup"
          :mine="true"
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
          transition="fadeGroupR"
          :mine="false"
          align="flex-end"
        />
        <img :src="getPictureUrl(opponent.id)" class="profile" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, defineExpose, defineProps } from "vue";
import { onMounted, Ref, ref } from "vue";
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
}

const props: Readonly<Props> = defineProps<Props>();
const timer: Ref<Array<string>> = ref(["00", "00"]);

function getPictureUrl(id: number): string {
  return "http://localhost:3000/api/users/avatar/" + id.toString();
}

function updateTimer() {
  const curTime = new Date();
  let milliDiff = curTime.getTime() - props.time.getTime();
  let minutes = Math.floor(milliDiff / 60000);
  let seconds = Math.floor(milliDiff / 1000) - 60 * minutes;
  timer.value[0] = (minutes < 10 ? "0" : "") + minutes.toString();
  timer.value[1] = (seconds < 10 ? "0" : "") + seconds.toString();
  setTimeout(() => {
    updateTimer();
  }, 100);
}

onMounted(() => {
  updateTimer();
});

defineExpose(
  defineComponent({
    name: "OverlayTopBar",
  })
);
</script>

<style scoped>
.overlayTopBar {
  width: 70%;
  height: 15%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.infoBar {
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

.timer {
  font-family: Arial, Helvetica, sans-serif;
  color: #bebebe;
  font-size: 18px;
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
