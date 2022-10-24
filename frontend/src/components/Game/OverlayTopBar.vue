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
          <img
            :src="playerL.picture"
            class="profilePP"
            v-bind:style="
              onLeftSide
                ? 'outline: 5px solid #ffcb00;'
                : 'outline: 5px solid rgba(0, 0, 0, 0.2);'
            "
          />
        </div>
        <UserChat
          :user="playerL"
          :message="messageL"
          transition="fadeGroup"
          align="flex-start"
          class="userChat"
        />
      </div>
      <div class="scores">
        <div class="scoreNb leftScore">{{ scores[0] }}</div>
        -
        <div class="scoreNb rightScore">{{ scores[1] }}</div>
      </div>
      <div class="playerInfoRight">
        <UserChat
          :user="playerR"
          :message="messageR"
          transition="fadeGroupR"
          align="flex-end"
          class="userChat"
        />
        <div class="profileBox">
          <EmoteBox
            :emoji="emojiR"
            :emojisURL="emojisURL"
            :time="emojiDateR"
            side="right"
          />
          <img
            :src="playerR.picture"
            class="profilePP"
            v-bind:style="
              onRightSide
                ? 'outline: 5px solid #ffcb00;'
                : 'outline: 5px solid rgba(0, 0, 0, 0.2);'
            "
          />
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
import { useUserStore } from "@/stores/user";

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
const user = useUserStore();
const onLeftSide = ref(false);
const onRightSide = ref(false);

onMounted(() => {
  if (user.id === props.playerL.id) onLeftSide.value = true;
  else if (user.id === props.playerR.id) onRightSide.value = true;
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
  gap: 10px;
}

.scoreNb {
  width: 40%;
  min-width: 100px;
  text-align: center;
}

.leftScore {
  text-align: right;
}

.rightScore {
  text-align: left;
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

.profilePP {
  display: block;
  width: 80px;
  min-width: 80px;
  height: 80px;
  min-height: 80px;
  object-fit: cover;
  border-radius: 100%;
  opacity: 1;
  transition: all 0.3s ease-out;
  border-radius: 100%;
}

@media screen and (max-width: 1050px) {
  .userChat {
    display: none;
  }
}
</style>
