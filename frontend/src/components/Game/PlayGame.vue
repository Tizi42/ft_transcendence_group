<template>
  <GameOverlay
    v-if="room_info != undefined"
    :room_name="room_name"
    :playerL_id="room_info.playerL"
    :playerR_id="room_info.playerR"
    :mode="room_info.mode"
  />
</template>

<script lang="ts" setup>
import socket from "@/socket";
import {
  ref,
  defineComponent,
  defineExpose,
  onBeforeMount,
  defineProps,
} from "vue";
import GameOverlay from "./GameOverlay.vue";
import { useUserStore } from "@/stores/user";
import router from "@/router";
import { roomInfo } from "@backend/game/utils/type";
import { StoreGeneric } from "pinia";

const user: StoreGeneric = useUserStore();

interface Props {
  room_name: string;
}

const props: Readonly<Props> = defineProps<Props>();
const room_info = ref();

onBeforeMount(() => {
  if (props.room_name === undefined) router.push({ name: "game" });
  socket.emit(
    "init_room",
    {
      room_name: props.room_name,
      user_id: user.id,
    },
    (data: roomInfo) => {
      room_info.value = data;
    }
  );
});

defineExpose(
  defineComponent({
    name: "PlayGame",
  })
);
</script>
