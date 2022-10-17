<template>
  <GameOverlay
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

const user = useUserStore();

interface Props {
  room_name: string;
}

const props: Readonly<Props> = defineProps<Props>();
const room_info = ref();

console.log(props);

onBeforeMount(() => {
  socket.emit(
    "init_room",
    {
      room_name: props.room_name,
      user_id: user.id,
    },
    (data: any) => {
      room_info.value = data;
      console.log("room_info: ", data);
    }
  );
});

defineExpose(
  defineComponent({
    name: "PlayGame",
  })
);
</script>
