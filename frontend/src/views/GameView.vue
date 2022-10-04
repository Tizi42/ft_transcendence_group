<template>
  <div class="menu">
    <router-link :to="{ name: 'play' }" class="gameButtonPlay">
      Play !
    </router-link>
    <router-link :to="{ name: 'play' }" class="gameButton">
      Watch a game
    </router-link>
    <router-link :to="{ name: 'leaderboard' }" class="gameButton">
      Leaderboard
    </router-link>
    <router-link :to="{ name: 'history' }" class="gameButton">
      Match history
    </router-link>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent } from "vue";

defineExpose(
  defineComponent({
    name: "GameView",
  })
);
</script>

<style scoped>
.gameButton,
.gameButtonPlay {
  display: block;
  background: none;
  color: var(--main-color);
  font-family: "Outfit SemiBold";
  font-size: 30px;
  margin: 0;
  width: 354px;
  padding: 15px;
  text-decoration: none;
  border: solid;
  border: 5px solid var(--main-color);
  border-radius: 53px;
  margin-top: 30px;
  transition: all 0.3s ease-out;
}

.gameButtonPlay {
  font-size: 40px;
  padding-top: 30px;
  padding-bottom: 30px;
  margin-bottom: 30px;
  border: 8px solid var(--main-color);
}

.menu {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.gameButton:hover,
.gameButtonPlay:hover {
  transform: scale(1.1);
}
</style>
