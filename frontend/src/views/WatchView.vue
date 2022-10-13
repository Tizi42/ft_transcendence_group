<template>
  <div class="menu">
    <div class="menuBox">
      <div v-for="room in rooms" :key="rooms.indexOf(room)">
        {{ room.room_name }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import socket from "@/socket";
import { defineComponent, defineExpose, onBeforeMount, onUpdated } from "vue";
import { GameRoomNS } from "@backend/game/utils/gameNS";

const rooms: Array<GameRoomNS> = [];

function fillRooms(data: GameRoomNS[]) {
  rooms.splice(0);
  data.forEach((value: GameRoomNS) => {
    console.log(value.room_name);
    rooms.push(value);
  });
}

onBeforeMount(() => {
  socket.emit("get_updated_rooms");
  socket.on("updated_rooms", (data: GameRoomNS[]) => {
    fillRooms(data);
  });
});

defineExpose(
  defineComponent({
    name: "WatchView",
  })
);
</script>
