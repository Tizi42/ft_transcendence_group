<template>
  <div class="match">
    <div class="matchResults" v-if="!battle.isFinished">
      <div class="opponentLeft">
        <div class="score"></div>
        <div class="name">Conan Edogawa</div>
        <img class="pp" src="@/assets/profile/conan.png" />
      </div>
      <fulfilling-bouncing-circle-spinner
        :animation-duration="4000"
        :size="20"
        color="#ffcb00"
      />
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
import { onMounted, onUpdated } from "vue";
import { ref } from "vue";
import { OrbitSpinner, SwappingSquaresSpinner } from "epic-spinners";
import { FulfillingBouncingCircleSpinner } from "epic-spinners";

//  variables
const props = defineProps(["battle"]);

//  usefull functions
function getTime(fullDate): string {
  let splitted = fullDate.split("T")[1].split(":");
  return splitted[0] + ":" + splitted[1];
}

function getDate(fullDate): string {
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

<style scoped>
.matchResults {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  width: 70%;
}

.matchDate {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  width: 10vw;
}

.opponentRight,
.opponentLeft {
  display: flex;
  align-items: center;
  width: 100%;
}

.opponentRight {
  justify-content: start;
  text-align: left;
}

.opponentLeft {
  justify-content: end;
  text-align: right;
}

.pp {
  width: 50px;
  margin-left: 1em;
  margin-right: 1em;
}

.name {
  width: 70%;
}

.winner .name {
  font-weight: 600;
  color: var(--main-color);
}

.looser img {
  opacity: 50%;
}

.match {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  width: 60vw;
}
</style>
