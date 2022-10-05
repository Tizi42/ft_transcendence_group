<template>
  <div class="pageCenter">
    <div class="overlayBox" v-if="dataReady">
      <OverlayTopBar
        :user="user"
        :opponent="opponent"
        :time="timer"
        :scores="scores"
      />
      <GameBox />
      <OverlayBottomBar
        :user="user"
        :opponent="opponentId"
        @getLastMessageUp="fillMessageInfo"
      />
      <ReadyButton v-if="readyStatus[0]" />
      <ReadyButton v-if="readyStatus[1]" />
      <Transition name="bounce">
        <MessageBox
          v-if="show"
          :message="lastMessage"
          :author="lastMessageAuthor"
          :dest="lastMessageDest"
          :user="user"
        />
      </Transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, defineExpose, onBeforeMount, onMounted } from "vue";
import { Ref, ref } from "vue";
import OverlayTopBar from "./OverlayTopBar.vue";
import OverlayBottomBar from "./OverlayBottomBar.vue";
import GameBox from "./GameBox.vue";
import ReadyButton from "./ReadyButton.vue";
import MessageBox from "./MessageBox.vue";
import { userInfoStore, useUserStore } from "@/stores/user";
import { Chat } from "@backend/chat/entities/chat.entity";
import { User } from "@backend/users/users.entity";
import { getUrlOf } from "@/router";

const user: Pick<userInfoStore, never> = useUserStore();
const opponent: Ref<User | null> = ref(null);
const opponentId = 4;
const lastMessage: Ref<string> = ref("");
const lastMessageAuthor: Ref<number> = ref(-1);
const lastMessageDest: Ref<number> = ref(-1);
const lastMessageTime: Ref<Date> = ref(new Date());
const show: Ref<boolean> = ref(false);
const dataReady: Ref<boolean> = ref(false);
const readyStatus: Ref<Array<boolean>> = ref([false, false]);
const timer: Ref<Date> = ref(new Date());
const scores: Array<number> = [0, 0];

function fillMessageInfo(message: Chat) {
  show.value = false;
  setTimeout(() => {
    lastMessage.value = message.content;
    lastMessageAuthor.value = message.author;
    lastMessageDest.value = message.dest;
    lastMessageTime.value = new Date();
    show.value = true;
    setTimeout(() => {
      const curTime = new Date();
      if (curTime.getTime() - lastMessageTime.value.getTime() > 3500)
        show.value = false;
    }, 4000);
  }, 100);
}

async function getOpponent(index: number) {
  dataReady.value = false;
  let response: Response = await fetch(getUrlOf("api/users/info/" + index), {
    credentials: "include",
  });
  opponent.value = await response.json();
  setTimeout(() => {
    dataReady.value = true;
  }, 500);
}

onBeforeMount(async () => {
  await getOpponent(opponentId);
  timer.value = new Date();
});

defineExpose(
  defineComponent({
    name: "GameOverlay",
  })
);

onBeforeMount(() => {
  show.value = false;
});
</script>

<style scoped>
.overlayBox {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  position: absolute;
  width: 80%;
  height: 90%;
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  cursor: default;
  background: rgba(30, 42, 2, 0.8);
  color: #ffffff;
  font-family: "Outfit";
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.75);
  border-radius: 58px;
}

.pageCenter {
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  background: var(--main-gradient-background);
}
</style>
