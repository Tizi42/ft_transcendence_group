<template>
  <div class="match" v-if="show">
    <div class="matchResults" v-if="!match.isFinished">
      <div class="opponentLeft">
        <div class="score">{{ match.score1 }}pts</div>
        <div class="name">{{ match.name1 }}</div>
        <img class="profile" :src="pp1" @click="showInfoBox(0)" />
      </div>
      <div class="vsWord">
        <LoadingRing color="#ffcb00" size="30px" height="30px" />
      </div>
      <div class="opponentRight">
        <img class="profile" :src="pp2" @click="showInfoBox(1)" />
        <div class="name">{{ match.name2 }}</div>
        <div class="score">{{ match.score2 }}pts</div>
      </div>
    </div>
    <div
      class="matchResults"
      v-else-if="match.isFinished && match.winner == match.opponent1"
    >
      <div class="opponentLeft winner">
        <div class="score">{{ match.score1 }}pts</div>
        <div class="name">{{ match.name1 }}</div>
        <img class="profile" :src="pp1" @click="showInfoBox(0)" />
      </div>
      <div class="vsWord">vs</div>
      <div class="opponentRight looser">
        <img class="profile" :src="pp2" @click="showInfoBox(1)" />
        <div class="name">{{ match.name2 }}</div>
        <div class="score">{{ match.score2 }}pts</div>
      </div>
    </div>
    <div
      class="matchResults"
      v-else-if="match.isFinished && match.winner == match.opponent2"
    >
      <div class="opponentLeft looser">
        <div class="score">{{ match.score1 }}pts</div>
        <div class="name">{{ match.name1 }}</div>
        <img class="profile" :src="pp1" @click="showInfoBox(0)" />
      </div>
      <div class="vsWord">vs</div>
      <div class="opponentRight winner">
        <img class="profile" :src="pp2" @click="showInfoBox(1)" />
        <div class="name">{{ match.name2 }}</div>
        <div class="score">{{ match.score2 }}pts</div>
      </div>
    </div>
    <div class="matchResults" v-else>
      <div class="opponentLeft looser">
        <div class="score">{{ match.score1 }}pts</div>
        <div class="name">{{ match.name1 }}</div>
        <img class="profile" :src="pp1" @click="showInfoBox(0)" />
      </div>
      <div class="vsWord">vs</div>
      <div class="opponentRight looser">
        <img class="profile" :src="pp2" @click="showInfoBox(1)" />
        <div class="name">{{ match.name2 }}</div>
        <div class="score">{{ match.score2 }}pts</div>
      </div>
    </div>
    <div class="matchDate">
      <div class="date">{{ getDate(match.date) }}</div>
      <div class="time">{{ getTime(match.date) }}</div>
    </div>
  </div>
  <teleport to="body">
    <UserBoxModal
      v-if="addWindow[0]"
      @hideUserBox="hide(0)"
      :target="players[0]"
    />
    <UserBoxModal
      v-if="addWindow[1]"
      @hideUserBox="hide(1)"
      :target="players[1]"
    />
  </teleport>
</template>

<script lang="ts" setup>
//  imports
import { getUrlOf } from "@/router";
import { defineComponent, defineExpose, defineProps, ref, Ref } from "vue";
import { onBeforeMount } from "vue";
import UserBoxModal from "../users/UserBox/UserBoxModal.vue";
import { User } from "@backend/users/users.entity";
import { BattleShow } from "@backend/battles/utils/battle-show";
import LoadingRing from "../utils/LoadingRing.vue";

//  variables
interface Props {
  match: BattleShow;
  pp1: string;
  pp2: string;
}

const props: Readonly<Props> = defineProps<Props>();
const show: Ref<boolean> = ref(false);
const players: Ref<Array<User>> = ref([]);
const addWindow: Ref<Array<boolean>> = ref([false, false]);

//  pop-up functions
function showInfoBox(nb: number) {
  addWindow.value[nb] = true;
}

function hide(nb: number) {
  addWindow.value[nb] = false;
}

//  usefull functions
function getTime(fullDate: Date): string {
  let splitted = fullDate.toString().split("T")[1].split(":");
  return splitted[0] + "h" + splitted[1];
}

function getDate(fullDate: Date): string {
  let splitted = fullDate.toString().split("T")[0].split("-");
  return splitted[1] + "/" + splitted[2] + "/" + splitted[0];
}

async function getName(id: number): Promise<string> {
  let response: Response;
  response = await fetch(getUrlOf("api/users/name/" + id), {
    credentials: "include",
  });
  return await response.text();
}

async function getPlayer(id: number): Promise<User> {
  let response: Response;
  response = await fetch(getUrlOf("api/users/info/" + id), {
    credentials: "include",
  });
  return await response.json();
}

//  lifecycle hook
onBeforeMount(async () => {
  players.value = [
    await getPlayer(props.match.opponent1),
    await getPlayer(props.match.opponent2),
  ];
  show.value = true;
});

//  expose component
defineExpose(
  defineComponent({
    name: "MatchResult",
  })
);
</script>
