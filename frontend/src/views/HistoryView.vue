<template>
  <div class="page">
    <div class="content">
      <div class="title">
        <div class="titleName">
          <img src="@/assets/icons/clock.svg" />
          <h1>Match history</h1>
        </div>
        <button class="reload" @click="reloadData()"></button>
      </div>
      <TableHistory
        title="Global"
        :ready="dataReady[0]"
        :battles="history[0]"
        :noMatch="noMatch[0]"
      />
      <TableHistory
        title="Personal"
        :ready="dataReady[1]"
        :battles="history[1]"
        :noMatch="noMatch[1]"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, defineExpose } from "vue";
import { onBeforeMount } from "vue";
import { Ref, ref } from "vue";
import { getUrlOf } from "@/router";
import TableHistory from "@/components/MatchHistory/TableHistory.vue";
import { useUserStore } from "@/stores/user";
import { BattleShow } from "@backend/battles/utils/battle-show";
import { StoreGeneric } from "pinia";

// variables
const user: StoreGeneric = useUserStore();
const dataReady: Ref<Array<boolean>> = ref([false, false]);
const history: Ref<Array<BattleShow[]>> = ref([[], []]);
const noMatch: Ref<Array<boolean>> = ref([false, true]);

// loading functions
async function reloadOne(index: number) {
  dataReady.value[index] = false;
  let response: Response = await fetch(
    getUrlOf("api/battles/show/" + (index == 0 ? "" : user.id)),
    {
      credentials: "include",
    }
  );
  history.value[index] = await response.json();
  setTimeout(() => {
    dataReady.value[index] = true;
  }, 500);
}

async function reloadData() {
  await reloadOne(0);
  await reloadOne(1);
  if (history.value[1].length > 0) noMatch.value[1] = false;
  else noMatch.value[1] = true;
}

onBeforeMount(async () => {
  await reloadData();
});

defineExpose(
  defineComponent({
    name: "HistoryView",
  })
);
</script>
