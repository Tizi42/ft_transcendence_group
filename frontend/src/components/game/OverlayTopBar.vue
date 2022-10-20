<template>
  <div class="overlayTopBar">
    <TimerStart :mode="props.mode" />
    <div class="infoBar" v-if="show">
      <div class="playerInfoLeft">
        <div class="profileBox">
          <EmoteBox
            :emoji="emojiL"
            :emojisURL="emojisURL"
            :time="emojiDateL"
            side="left"
          />
          <img :src="playerL.picture" class="profile" />
        </div>
        <UserChat
          :user="playerL"
          :message="messageL"
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
          :user="playerR"
          :message="messageR"
          transition="fadeGroupR"
          align="flex-end"
        />
        <div class="profileBox">
          <EmoteBox
            :emoji="emojiR"
            :emojisURL="emojisURL"
            :time="emojiDateR"
            side="right"
          />
          <img :src="playerR.picture" class="profile" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, defineExpose, defineProps } from "vue";
import { Ref, ref, onMounted } from "vue";
import TimerStart from "../utils/TimerStart.vue";
import UserChat from "./UserChat.vue";
import EmoteBox from "./EmoteBox.vue";
import { UserMinimal } from "@/components/utils/UserMinimal";
import { messageInGame } from "@backend/chat/utils/types";

interface Props {
  playerL: UserMinimal;
  playerR: UserMinimal;
  scores: Array<number>;
  messageL: messageInGame | null;
  messageR: messageInGame | null;
  emojisURL: Array<URL>;
  emojiL: number;
  emojiR: number;
  emojiDateL: Date;
  emojiDateR: Date;
  mode: string;
}

const props: Readonly<Props> = defineProps<Props>();
const show: Ref<boolean> = ref(false);

function getPictureUrl(id: number): string {
  return "http://localhost:3000/api/users/avatar/" + id.toString();
}

onMounted(() => {
  show.value = true;
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

.profileBox {
  display: block;
  width: 80px;
  height: 80px;
  width: auto;
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
</style>
