<template>
  <div class="playerResults">
    <div class="playerInfo">
      <div class="positionLb">{{ pos }}</div>
      <img class="profile" :src="pp" @click="showInfoBox" />
      <div class="namePlayer">{{ player.displayName }}</div>
      <div class="username">@{{ player.username }}</div>
    </div>
    <div class="results">
      <div class="points">{{ player.totalVictories }}</div>
      <div class="winRate">{{ getWinRate() }}</div>
      <div class="gamesNb">{{ player.totalGames }}</div>
    </div>
  </div>
  <div class="nofriends" v-if="alone">You don't have any friend &#128533;</div>
  <teleport to="body">
    <UserBoxModal v-if="addWindow" @hide="hide">
      <UserBox :target="player" />
    </UserBoxModal>
  </teleport>
</template>

<script lang="ts" setup>
//  imports
import { User } from "./../../../backend/users/users.entity";
import { defineComponent } from "vue";
import { ref } from "vue";
import UserBoxModal from "../users/UserBox/UserBoxModal.vue";
import UserBox from "../users/UserBox/UserBox.vue";

//  variables
interface Props {
  player: User;
  pos: number;
  pp: string;
  alone: boolean;
}

const props: Readonly<Props> = defineProps<Props>();
const addWindow = ref(false);

function showInfoBox() {
  addWindow.value = true;
}

function hide() {
  addWindow.value = false;
}

// usefull functions
function getWinRate(): string {
  if (props.player.winRate == -1) return "-";
  return props.player.winRate + "%";
}

//  expose component
defineExpose(
  defineComponent({
    name: "PlayerResult",
  })
);
</script>
