<template>
  <div class="match" v-if="show">
    <div class="matchResults" v-if="!match.isFinished">
      <div class="opponentLeft">
        <div class="score">{{ match.score1 }}</div>
        <div class="name">{{ name1 }}</div>
        <img class="profile" :src="pp1" />
      </div>
      ...
      <div class="opponentRight">
        <img class="profile" :src="pp2" />
        <div class="name">{{ name2 }}</div>
        <div class="score">{{ match.score2 }}</div>
      </div>
    </div>
    <div
      class="matchResults"
      v-else-if="match.isFinished && match.winner == match.opponent1"
    >
      <div class="opponentLeft winner">
        <div class="score">{{ match.score1 }}</div>
        <div class="name">{{ name1 }}</div>
        <img class="profile" :src="pp1" />
      </div>
      vs
      <div class="opponentRight looser">
        <img class="profile" :src="pp2" />
        <div class="name">{{ name2 }}</div>
        <div class="score">{{ match.score2 }}</div>
      </div>
    </div>
    <div class="matchResults" v-else>
      <div class="opponentLeft looser">
        <div class="score">{{ match.score1 }}</div>
        <div class="name">{{ name1 }}</div>
        <img class="profile" :src="pp1" />
      </div>
      vs
      <div class="opponentRight winner">
        <img class="profile" :src="pp2" />
        <div class="name">{{ name2 }}</div>
        <div class="score">{{ match.score2 }}</div>
      </div>
    </div>
    <div class="matchDate">
      <div class="date">{{ getDate(match.date_start) }}</div>
      <div class="time">{{ getTime(match.date_start) }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
//  imports
import { getUrlOf } from "@/router";
import { Battle } from "@backend/battles/battle.entity";
import { defineComponent, defineExpose, defineProps, ref, Ref } from "vue";
import { onMounted } from "vue";

//  variables
interface Props {
  match: Battle;
  pp1: string;
  pp2: string;
}

const props: Readonly<Props> = defineProps<Props>();
const show: Ref<boolean> = ref(false);
const name1: Ref<string> = ref("name1");
const name2: Ref<string> = ref("name2");

//  usefull functions
function getTime(fullDate: Date): string {
  let splitted = fullDate.toString().split("T")[1].split(":");
  return splitted[0] + ":" + splitted[1];
}

function getDate(fullDate: Date): string {
  let splitted = fullDate.toString().split("T")[0].split("-");
  return splitted[1] + "." + splitted[2];
}

async function getName(id: number): Promise<string> {
  let response: Response;
  response = await fetch(getUrlOf("api/users/name/" + id), {
    credentials: "include",
  });
  return await response.text();
}

//  lifecycle hook
onMounted(async () => {
  name1.value = await getName(props.match.opponent1);
  name2.value = await getName(props.match.opponent2);
  show.value = true;
});

//  expose component
defineExpose(
  defineComponent({
    name: "MatchResult",
  })
);
</script>
