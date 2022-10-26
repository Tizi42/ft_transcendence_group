<template>
  <div class="wrapperItem">
    <div class="modeTag">
      <img
        :src="props.modeIcon.toString()"
        class="modeIcon"
        @load="onLoad()"
        v-show="show"
      />
    </div>
    <div class="matchInfo">
      <div class="leftPlayer">
        <img :src="pictureL" />
        <div class="name">
          {{ nameL }}
        </div>
      </div>
      <div class="vsTxt">vs</div>
      <div class="rightPlayer">
        <div class="name">
          {{ nameR }}
        </div>
        <img :src="pictureR" />
      </div>
    </div>
    <button @click="joinGame()" class="watchGame">
      <img src="@/assets/icons/watchGame.svg" />
      Watch
    </button>
  </div>
</template>

<script lang="ts" setup>
import router, { getUrlOf } from "@/router";
import socket from "@/socket";
import { useUserStore } from "@/stores/user";
import { GameRoomNS } from "@backend/game/utils/gameNS";
import {
  defineComponent,
  defineExpose,
  defineProps,
  onBeforeMount,
  onMounted,
} from "vue";
import { Ref, ref } from "vue";

interface Props {
  room: GameRoomNS;
  modeIcon: URL;
}

const user = useUserStore();

const props: Readonly<Props> = defineProps<Props>();
const show: Ref<boolean> = ref(false);
const nameL: Ref<string> = ref("");
const nameR: Ref<string> = ref("");
const pictureL: Ref<string> = ref("");
const pictureR: Ref<string> = ref("");

function onLoad() {
  show.value = true;
}

function joinGame() {
  if (user.status === "in game") {
    window.alert("You already have a running game, please close it first.");
    return;
  }
  console.log("joining", props.room.room_name);
  const data = {
    room_name: props.room.room_name,
    user_id: user.id,
  };
  socket.emit("init_room", data, () => {
    router.push({ name: "pong", params: { room_name: props.room.room_name } });
  });
}

// async function getPictureUrl(id: number): Promise<string> {
//   const picture: Ref<string> = ref("");
// await fetch(getUrlOf("api/users/picture/") + id, {
//   credentials: "include",
// })
//   .then((response) => {
//     return response.json();
//   })
//   .then((data) => {
//     picture.value = data;
//   })
//   .catch((error) => {
//     console.log("error :", error);
//   });
//   return picture.value;
// }

async function getName(id: number): Promise<string> {
  let response: Response;
  response = await fetch(getUrlOf("api/users/name/" + id), {
    credentials: "include",
  });
  return await response.text();
}

//  lifecycle hook
onMounted(async () => {
  nameL.value = await getName(props.room.playerL);
  nameR.value = await getName(props.room.playerR);
});

onBeforeMount(async () => {
  await fetch(getUrlOf("api/users/picture/") + props.room.playerR, {
    credentials: "include",
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      pictureR.value = data;
    })
    .catch((error) => {
      console.log("error :", error);
    });
  await fetch(getUrlOf("api/users/picture/") + props.room.playerL, {
    credentials: "include",
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      pictureL.value = data;
    })
    .catch((error) => {
      console.log("error :", error);
    });
});

defineExpose(
  defineComponent({
    name: "MatchItem",
  })
);
</script>

<style scoped>
.watchGame {
  margin-left: 5%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  color: var(--main-color);
  background: #141d01;
  box-shadow: 0px 0px 4px 2px #00000040;
  outline: none;
  border: none;
  font-size: 20px;
  padding: 0.8em 1.5em;
  border-radius: 15px;
  transition: transform 0.5s ease;
  margin-right: 20px;
  width: fit-content;
}

.watchGame > img {
  width: 24px;
  height: 24px;
}

.watchGame:hover {
  cursor: pointer;
  transform: scale(1.1);
}

.wrapperItem {
  position: relative;
  width: 60vw;
  min-width: 700px;
  height: 100px;
  background: #1e2a02e6;
  box-shadow: 0px 4px 4px #00000040;
  border-radius: 22px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.matchInfo {
  display: flex;
  position: relative;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-left: 70px;
  max-width: 700px;
  width: 100%;
  gap: 20px;
}

.modeTag {
  position: absolute;
  left: 0px;
  top: 0px;
  height: 100px;
  width: 45px;
  background: #141d01;
  border-radius: 22px 0px 0px 22px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modeIcon {
  height: 24px;
  width: 24px;
}

.leftPlayer,
.rightPlayer {
  display: flex;
  justify-content: left;
  align-items: center;
  gap: 20px;
  width: 100%;
  word-break: break-word;
  font-size: 20px;
}

.leftPlayer > .name,
.rightPlayer > .name {
  width: 100%;
  text-align: right;
}

.leftPlayer > .name {
  text-align: left;
}

.leftPlayer > img,
.rightPlayer > img {
  width: 57px;
  height: 57px;
  border-radius: 100%;
  object-fit: cover;
}

.vsTxt {
  font-size: 40px;
  font-family: "Outfit Bold";
}
</style>
