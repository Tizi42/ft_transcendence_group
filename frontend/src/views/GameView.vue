<template>
  <div class="menu" v-if="logged">
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
import { defineComponent, defineExpose } from "vue";
import { onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const logged = ref(false);

async function checkIfLogged() {
  await fetch("http://localhost:3000/api/private", {
    credentials: "include",
  }).then((response) => {
    if (response.status != 200) {
      router.push({
        name: "login",
      });
    } else {
      logged.value = true;
    }
  });
}

onBeforeMount(async () => {
  await checkIfLogged();
  console.log("login");
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
  margin-top: 30px;
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
</style>
