<template>
  <div class="container">
    <GamePlay></GamePlay>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import GamePlay from "../components/game/GamePlay.vue";

export default defineComponent({
  name: "PlayView",
  components: { GamePlay },
});
</script>
