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
      />
      <LeaderBoard
        title="Friends"
        :ready="dataReady[1]"
        :leaderboard="leaderboard[1]"
        :reorder="reloadAndOrder(1)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import "@/assets/styles/historyAndLeaderboard.css";
import { defineComponent, defineExpose, Ref, ref } from "vue";
import { onBeforeMount } from "vue";
import { getUrlOf } from "@/router";
import { User } from "@backend/users/Users.entity";
import LeaderBoard from "@/components/Leaderboard/Leaderboard.vue";

const dataReady: Ref<Array<boolean>> = ref([false, false]);
const leaderboard: Ref<Array<User[]>> = ref([[], []]);
const orders: Ref<Array<number>> = ref([1, 1]);

async function reloadOne(index: number) {
  let response: Response = await fetch(
    getUrlOf(
      "api/users/leaderboard?order=" +
        orders.value[index].toString() +
        "&global=" +
        (index == 0 ? "true" : "false")
    ),
    {
      credentials: "include",
    }
  );
  leaderboard.value[index] = await response.json();
  dataReady.value[index] = true;
}

async function reloadAll() {
  reloadOne(0);
  reloadOne(1);
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
