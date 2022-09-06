<template>
  <div class="playerResults">
    <div class="playerInfo">
      <div>{{ pos }}</div>
      <img class="profile" src="@/assets/profile/conan.png" />
      <div class="namePlayer">{{ player.displayName }}</div>
      <div class="username">@{{ player.username }}</div>
    </div>
    <div class="results">
      <div class="points">1958</div>
      <div class="winRate">85.2%</div>
      <div class="gamesNb">203</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
//  imports
import { defineComponent, defineExpose, defineProps } from "vue";
import { FulfillingBouncingCircleSpinner } from "epic-spinners";

//  variables
defineProps(["player", "pos"]);

//  expose component
defineExpose(
  defineComponent({
    name: "PlayerResult",
  })
);
</script>
