<template>
  <div class="pageCenter">
    <div class="wrapperListMatch">
      <div class="title">
        <img src="@/assets/icons/pingpong.svg" />
        Ongoing games
      </div>
      <div class="listMatches" v-if="show">
        <MatchList :rooms="rooms" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import socket from "@/socket";
import { defineComponent, defineExpose, onBeforeMount } from "vue";
import { Ref, ref } from "vue";
import { GameRoomNS } from "@backend/game/utils/gameNS";
import MatchList from "@/components/WatchGame/MatchList.vue";

const rooms: Array<GameRoomNS> = [];
const show: Ref<boolean> = ref(false);

async function fillRooms(data: GameRoomNS[]) {
  rooms.splice(0);
  for await (const value of data) {
    rooms.push(value);
  }
}

onBeforeMount(() => {
  socket.emit("get_updated_rooms");
  socket.on("updated_rooms", async (data: GameRoomNS[]) => {
    show.value = false;
    await fillRooms(data);
    show.value = true;
  });
  socket.on("games_update", () => {
    socket.emit("get_updated_rooms");
  });
});

defineExpose(
  defineComponent({
    name: "WatchView",
  })
);
</script>

<style scoped>
.pageCenter {
  display: flex;
  position: absolute;
  align-items: center;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
}

.wrapperListMatch {
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: flex-start;
  padding-top: 7vh;
  padding-bottom: 5vh;
  gap: 60px;
  width: 70vw;
  min-width: 800px;
  height: 70vh;
  background: #1e2a02cc;
  box-shadow: 0px 0px 8px #000000bf;
  border-radius: 58px;
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  cursor: default;
  color: #bebebe;
  overflow: auto;
  scrollbar-width: none;
}

.wrapperListMatch::-webkit-scrollbar {
  display: none;
}

.wrapperListMatch > .title {
  width: 60vw;
  min-width: 700px;
  justify-content: flex-start;
  align-items: center;
  color: var(--main-color);
  font-size: 30px;
  font-family: "Outfit Bold";
}

.listMatches {
  width: 100%;
}
</style>
