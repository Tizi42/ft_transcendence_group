<template>
  <div class="matchSmall">
    <div class="matchSmallResults" v-if="match.winner == match.opponent1">
      <div class="opponentLeft winner">
        <div class="nameSmall">{{ match.name1 }}</div>
        <img class="profileSmall" :src="pp1" />
      </div>
      <img :src="modeIcon.toString()" class="smallModeIcon" />
      <div class="opponentRight looser">
        <img class="profileSmall" :src="pp2" />
        <div class="nameSmall">{{ match.name2 }}</div>
      </div>
    </div>
    <div class="matchSmallResults" v-else-if="match.winner == match.opponent2">
      <div class="opponentLeft looser">
        <div class="nameSmall">{{ match.name1 }}</div>
        <img class="profileSmall" :src="pp1" />
      </div>
      <img :src="modeIcon.toString()" class="smallModeIcon" />
      <div class="opponentRight winner">
        <img class="profileSmall" :src="pp2" />
        <div class="nameSmall">{{ match.name2 }}</div>
      </div>
    </div>
    <div class="matchSmallResults" v-else>
      <div class="opponentLeft looser">
        <div class="nameSmall">{{ match.name1 }}</div>
        <img class="profileSmall" :src="pp1" />
      </div>
      <img :src="modeIcon.toString()" class="smallModeIcon" />
      <div class="opponentRight looser">
        <img class="profileSmall" :src="pp2" />
        <div class="nameSmall">{{ match.name2 }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
//  imports
import { defineComponent, defineExpose, defineProps } from "vue";
import { BattleShow } from "@backend/battles/utils/battle-show";

//  variables
interface Props {
  match: BattleShow;
  pp1: string;
  pp2: string;
  modeIcon: URL;
}

defineProps<Props>();

//  expose component
defineExpose(
  defineComponent({
    name: "SmallMatchResult",
  })
);
</script>
