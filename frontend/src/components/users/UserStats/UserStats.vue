<template>
  <div class="statistics">
    <div class="stats-section">
      <div class="stats-item">
        <WinGraph
          :totalGames="user.totalGames"
          :totalVictories="user.totalVictories"
          :totalDraws="user.totalDraws"
        />
      </div>
      <div class="stats-item">
        <div class="statValue">{{ getWinRate() }}</div>
        <div>Win Rate</div>
      </div>
      <div class="stats-item">
        <div class="statValue">{{ getRank() }}</div>
        <div>Rank</div>
      </div>
      <div class="stats-item">
        <div class="statValue">{{ user.totalGames }}</div>
        <div>Matches</div>
      </div>
      <div class="stats-item">
        <div class="statValue">{{ getLeague() }}</div>
        <div>League</div>
      </div>
    </div>
    <div class="historyTable">
      <TableHistory
        title="History"
        :ready="historyReady"
        :battles="history"
        :noMatch="noMatch"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getUrlOf } from "@/router";
import { useUserStore } from "@/stores/user";
import { User } from "@backend/users/users.entity";
import { defineExpose, defineComponent } from "vue";
import { onBeforeMount, ref, Ref } from "vue";
import WinGraph from "./WinGraph.vue";
import TableHistory from "@/components/MatchHistory/TableHistory.vue";
import { BattleShow } from "@backend/battles/utils/battle-show";
import { StoreGeneric } from "pinia";

const user: StoreGeneric = useUserStore();
const dataReady: Ref<boolean> = ref(false);
const historyReady: Ref<boolean> = ref(false);
const leaderboard: Ref<User[]> = ref([]);
const history: Ref<BattleShow[]> = ref([]);
const noMatch: Ref<boolean> = ref(true);
const leagues: string[] = [
  "Challenger",
  "Grand Master",
  "Master",
  "Diamond",
  "Gold",
  "Silver",
];
const tiers: number[] = [1, 2, 5, 10, 20, 50];

async function reload() {
  dataReady.value = false;
  let response: Response = await fetch(
    getUrlOf("api/users/leaderboard?order=1&global=true&mine=" + user.id),
    {
      credentials: "include",
    }
  );
  leaderboard.value = await response.json();
  setTimeout(() => {
    dataReady.value = true;
  }, 500);
}

async function reloadHistory() {
  historyReady.value = false;
  let response: Response = await fetch(
    getUrlOf("api/battles/show/" + user.id),
    {
      credentials: "include",
    }
  );
  history.value = await response.json();
  setTimeout(() => {
    historyReady.value = true;
  }, 500);
}

function getWinRate(): string {
  if (user.winRate == -1) return "-";
  return user.winRate + "%";
}

function getRank(): number {
  for (var i = 0; i < leaderboard.value.length; i++)
    if (leaderboard.value[i].id == user.id) return i + 1;
  return leaderboard.value.length + 1;
}

function getLeague(): string {
  let tier: number = Math.floor((getRank() / leaderboard.value.length) * 100);
  for (let i = 0; i < tiers.length; i++) {
    if (tier <= tiers[i]) return leagues[i];
  }
  return "Bronze";
}

onBeforeMount(async () => {
  user.doFetch();
  await reload();
  await reloadHistory();
  if (history.value.length > 0) noMatch.value = false;
  else noMatch.value = true;
});

defineExpose(
  defineComponent({
    name: "UserStats",
  })
);
</script>

<style scoped>
.statistics {
  position: absolute;
  top: 0;
  width: 86%;
  display: flex;
  flex-direction: column;
  margin-left: 7%;
  margin-right: 7%;
  gap: 50px;
}

.stats-section {
  background-color: var(--dark-green-background);
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  text-align: left;
  border-radius: 22px;
  color: #dedede;
  padding: 42px 0px;
}

.stats-item {
  display: flex;
  flex-direction: column;
  justify-content: left;
  font-family: "Outfit";
  font-style: normal;
  font-weight: light;
  font-size: 24px;
  width: 15%;
}

.statValue {
  color: var(--main-color);
}

.historyTable {
  margin-bottom: 50px;
}
</style>
