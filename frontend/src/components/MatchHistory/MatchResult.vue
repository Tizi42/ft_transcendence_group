<template>
  <div class="match">
    <div class="matchResults" v-if="!battle.isFinished">
      <div class="opponentLeft">
        <div class="score"></div>
        <div class="name">Conan Edogawa</div>
        <img class="pp" src="@/assets/profile/conan.png" />
      </div>
      ...
      <div class="opponentRight">
        <img class="pp" src="@/assets/profile/ran.png" />
        <div class="name">Ran Mouri</div>
        <div class="score"></div>
      </div>
    </div>
    <div
      class="matchResults"
      v-else-if="battle.isFinished && battle.winner == battle.opponent1"
    >
      <div class="opponentLeft winner">
        <div class="score">10</div>
        <div class="name">Conan Edogawa</div>
        <img class="pp" src="@/assets/profile/conan.png" />
      </div>
      vs
      <div class="opponentRight looser">
        <img class="pp" src="@/assets/profile/ran.png" />
        <div class="name">Ran Mouri</div>
        <div class="score">3</div>
      </div>
    </div>
    <div class="matchResults" v-else>
      <div class="opponentLeft looser">
        <div class="score">10</div>
        <div class="name">Conan Edogawa</div>
        <img class="pp" src="@/assets/profile/conan.png" />
      </div>
      vs
      <div class="opponentRight winner">
        <img class="pp" src="@/assets/profile/ran.png" />
        <div class="name">Ran Mouri</div>
        <div class="score">3</div>
      </div>
    </div>
    <div class="matchDate">
      <div class="date">{{ getDate(battle.date_start) }}</div>
      <div class="time">{{ getTime(battle.date_start) }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
//  imports
import { defineComponent, defineExpose, defineProps } from "vue";

//  variables
defineProps(["battle"]);

//  usefull functions
function getTime(fullDate: string): string {
  let splitted = fullDate.split("T")[1].split(":");
  return splitted[0] + ":" + splitted[1];
}

function getDate(fullDate: string): string {
  let splitted = fullDate.split("T")[0].split("-");
  return splitted[1] + "." + splitted[2];
}

//  expose component
defineExpose(
  defineComponent({
    name: "MatchResult",
  })
);
</script>
