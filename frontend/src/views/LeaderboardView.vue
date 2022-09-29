<template>
  <div class="page">
    <div class="title">
      <div class="titleName">
        <img src="@/assets/icons/leaderboard.svg" />
        <h1>Leaderboard</h1>
      </div>
      <button class="reload" @click="reloadAll()"></button>
    </div>
    <div class="content">
      <LeaderBoard
        title="Global"
        :ready="dataReady[0]"
        :leaderboard="leaderboard[0]"
        :reorder="reloadAndOrder(0)"
        :alone="false"
      />
      <LeaderBoard
        title="Friends"
        :ready="dataReady[1]"
        :leaderboard="leaderboard[1]"
        :reorder="reloadAndOrder(1)"
        :alone="alone"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import "@/assets/styles/historyAndLeaderboard.css";
import { defineComponent, defineExpose, Ref, ref } from "vue";
import { onBeforeMount } from "vue";
import { getUrlOf } from "@/router";
import { User } from "@backend/users/users.entity";
import LeaderBoard from "@/components/Leaderboard/Leaderboard.vue";
import { useUserStore } from "@/stores/user";

const user = useUserStore();
const dataReady: Ref<Array<boolean>> = ref([false, false]);
const leaderboard: Ref<Array<User[]>> = ref([[], []]);
const orders: Ref<Array<number>> = ref([1, 1]);
const alone: Ref<boolean> = ref(true);

async function reloadOne(index: number) {
  dataReady.value[index] = false;
  let response: Response = await fetch(
    getUrlOf(
      "api/users/leaderboard?order=" +
        orders.value[index].toString() +
        "&global=" +
        (index == 0 ? "true" : "false") +
        "&mine=" +
        user.id
    ),
    {
      credentials: "include",
    }
  );
  leaderboard.value[index] = await response.json();
  setTimeout(() => {
    dataReady.value[index] = true;
  }, 500);
}

async function reloadAll() {
  await reloadOne(0);
  await reloadOne(1);
  if (leaderboard.value[1].length > 1) alone.value = false;
  else alone.value = true;
}

function reloadAndOrder(index: number) {
  return async function reloadAndOrderFunc(order: number) {
    orders.value[index] = order;
    reloadOne(index);
  };
}

onBeforeMount(async () => {
  await reloadAll();
});

defineExpose(
  defineComponent({
    name: "LeaderboardView",
  })
);
</script>
