<template>
  <div class="playerResults">
    <div class="playerInfo">
      <div class="positionLb">{{ pos }}</div>
      <img class="profile" :src="pp" />
      <div class="namePlayer">{{ player.displayName }}</div>
      <div class="username">@{{ player.username }}</div>
    </div>
    <div class="results">
      <div class="points">{{ player.totalVictories }}</div>
      <div class="winRate">{{ player.winRate }}%</div>
      <div class="gamesNb">{{ player.totalGames }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
//  imports
import { defineComponent, defineExpose, defineProps } from "vue";

//  variables
defineProps(["player", "pos", "pp"]);

//  expose component
defineExpose(
  defineComponent({
    name: "PlayerResult",
  })
);
</script>
