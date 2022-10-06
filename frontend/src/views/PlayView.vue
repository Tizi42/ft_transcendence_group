<template>
  <div class="container">
    <GameRoom />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import GameRoom from "../components/game/GameRoom.vue";

export default defineComponent({
  name: "PlayView",
  components: { GameRoom },
});
</script>
