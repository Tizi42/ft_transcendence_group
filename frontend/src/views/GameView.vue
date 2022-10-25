<template>
  <div class="menu">
    <div class="menuBox">
      <router-link :to="{ name: 'play' }" class="gameButtonPlay">
        Play !
      </router-link>
      <router-link :to="{ name: 'watch' }" class="gameButton">
        Watch a game
      </router-link>
      <router-link :to="{ name: 'leaderboard' }" class="gameButton">
        Leaderboard
      </router-link>
      <router-link :to="{ name: 'history' }" class="gameButton">
        Match history
      </router-link>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeRouteLeave, RouteLocationNormalized } from "vue-router";
import { defineComponent, defineExpose, onBeforeMount, onMounted } from "vue";
import { useUserStore } from "@/stores/user";

const user = useUserStore();

onMounted(() => {
  onBeforeRouteLeave((to: RouteLocationNormalized) => {
    if (
      user.status === "in game" &&
      (to.name === "play" || to.name === "watch")
    ) {
      window.alert("You already have a running game, please close it first.");
      return false;
    }
    return true;
  });
});

onBeforeMount(() => {
  user.doFetch();
});

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
  justify-content: center;
}

.menuBox {
  display: flex;
  gap: 20px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #1e2a02cc;
  box-shadow: 0px 0px 8px #000000bf;
  border-radius: 58px;
  padding: 3% 6%;
  position: absolute;
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
}

.gameButton:hover,
.gameButtonPlay:hover {
  transform: scale(1.1);
}
</style>
