<template>
  <div v-if="context === 'channel'" class="return" @click="closeUser">
    <img src="@/assets/icons/arrowLeft.svg" />
  </div>
  <TransitionGroup name="slide-top">
    <div class="infoBox" v-if="show">
      <div
        class="avatarFrame"
        :style="{
          'background-image': 'url(' + target.picture + ')',
        }"
      ></div>
      <div class="nameAdd">
        <button
          v-if="pending"
          id="cancelButton"
          class="buttons"
          @click="onCancel"
        >
          <span class="hoverInfo">Cancel request</span>
        </button>
        <button
          v-if="!pending && !friendWith"
          id="sendButton"
          class="buttons"
          @click="onSend"
        >
          <span class="hoverInfo">Add friend</span>
        </button>
        <div class="target-name">{{ target.displayName }}</div>
      </div>
      <div class="target-username">
        <div>@{{ target.username }}</div>
        <div>#{{ target.id }}</div>
      </div>
    </div>
    <div class="statsBox" v-if="show">
      <div class="subtitleBox">
        <img src="@/assets/icons/stats.svg" />
        Statistics
      </div>
      <table class="statistics">
        <tbody>
          <tr class="firstRow">
            <td>Victories</td>
            <td>Win Rate</td>
            <td>Games</td>
          </tr>
          <tr>
            <td>{{ target.totalVictories }}</td>
            <td>{{ getWinRate() }}</td>
            <td>{{ target.totalGames }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="friendsBox" v-if="show">
      <div class="subtitleBox">
        <img src="@/assets/icons/friends.svg" />
        Friends ({{ nbFriends }})
      </div>
    </div>
    <button
      @click="inviteToPlay()"
      v-if="target.status === 'online' && target.id != user.id"
      class="inviteBtn"
    >
      Invite to Play
    </button>
  </TransitionGroup>
  <InvitationModal
    @hideInvitation="hideInvitation"
    :friend="props.target"
    v-if="inviteWindow"
  />
</template>

<script lang="ts" setup>
import {
  ref,
  defineComponent,
  defineExpose,
  defineProps,
  defineEmits,
} from "vue";
import { Ref, onBeforeMount } from "vue";
import { useUserStore } from "@/stores/user";
import axios from "axios";
import { User } from "@backend/users/users.entity";
import { getUrlOf } from "@/router";
import socket from "@/socket";
import { StoreGeneric } from "pinia";
import InvitationModal from "@/components/Game/invitation/InvitationModal.vue";

interface Props {
  target: User;
  context?: string;
}

const props: Readonly<Props> = defineProps<Props>();
const user: StoreGeneric = useUserStore();
const inviteWindow: Ref<boolean> = ref(false);
const pending: Ref<boolean> = ref(false);
const friendWith: Ref<boolean> = ref(false);
const nbFriends: Ref<number> = ref(0);
const show: Ref<boolean> = ref(false);
const emit = defineEmits(["closeUserBox", "statusOn", "statusOff"]);

function onSend() {
  const data = {
    from: user.id,
    to: props.target.id,
  };
  socket.emit("request_friendship", data);
  axios
    .post(getUrlOf("api/users/friends/add"), {
      id1: user.id,
      id2: props.target.id,
    })
    .then(function () {
      pending.value = true;
      socket.emit("update_friend", {
        from: props.target.id,
        to: user.id,
      });
    })
    .catch(function (error: Error) {
      console.log(error);
    });
}

function onCancel() {
  axios
    .post(getUrlOf("api/users/friends/ignore"), {
      id1: user.id,
      id2: props.target.id,
    })
    .then(function () {
      pending.value = false;
      socket.emit("update_friend", {
        from: props.target.id,
        to: user.id,
      });
    })
    .catch(function (error: Error) {
      console.log(error);
    });
}

function getWinRate(): string {
  if (props.target.winRate == -1) return "-";
  return props.target.winRate + "%";
}

async function getFriendShipInfo() {
  let getFriendLvl: Response = await fetch(
    getUrlOf(
      "api/users/friendship?target=" + props.target.id + "&mine=" + user.id
    ),
    {
      credentials: "include",
    }
  );
  let getNbFriend: Response = await fetch(
    getUrlOf("api/users/friends/" + user.id),
    {
      credentials: "include",
    }
  );
  let res: number = await getFriendLvl.json();
  if (res == 0) friendWith.value = true;
  else if (res == 1) pending.value = true;
  let friends: User[] = await getNbFriend.json();
  nbFriends.value = friends.length;
}

function hideInvitation() {
  inviteWindow.value = false;
  emit("statusOff");
}

function inviteToPlay() {
  inviteWindow.value = true;
  emit("statusOn");
}

function closeUser() {
  emit("closeUserBox");
}

onBeforeMount(async () => {
  show.value = false;
  await getFriendShipInfo();
  show.value = true;
});

defineExpose(
  defineComponent({
    name: "UserBox",
  })
);
</script>

<style scoped>
.return {
  position: fixed;
  top: 25px;
  left: 25px;
  cursor: pointer;
  width: 35vw;
  max-width: 700px;
  min-width: 500px;
  transition: transform 0.5s ease;
  display: flex;
  flex-direction: row;
  justify-content: left;
}

.return:hover {
  transform: scale(1.02, 1.02);
}

.return img {
  width: 30px;
}

.target-name {
  font-family: "Outfit Bold";
  font-size: 24px;
}

.target-username {
  color: #888888;
  line-height: 1.4em;
}

.avatarFrame {
  border-radius: 100%;
  background-position: center;
  background-size: cover;
  min-width: 100px;
  height: 100px;
  align-self: center;
  margin-bottom: 15px;
  outline-color: var(--main-color);
  outline-width: 3px;
}

.buttons {
  display: block;
  border: none;
  width: 30px;
  height: 30px;
  transition: transform 0.3s ease-in-out;
  background: none;
  background-size: contain;
  background-repeat: no-repeat;
}

.buttons:enabled:hover {
  cursor: pointer;
  transform: scale(1.1, 1.1);
}

#cancelButton {
  background-image: url("@/assets/icons/removeUser.svg");
}

#sendButton {
  background-image: url("@/assets/icons/addUser.svg");
}

#cancelButton .hoverInfo,
#sendButton .hoverInfo {
  opacity: 0;
  width: 120px;
  background-color: #000000dd;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  position: absolute;
  transition: all 0.5s ease-in-out 0s;
  transform: translateX(10px) translateY(10px);
  z-index: 997;
}

#cancelButton:hover .hoverInfo,
#sendButton:hover .hoverInfo {
  opacity: 1;
  transition: all 0.5s ease-in-out 1.2s;
}

.nameAdd {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}

.statistics {
  width: 75%;
  line-height: 1.5em;
  margin-bottom: 5%;
}

.subtitleBox {
  font-family: "Outfit";
  font-weight: 600;
  font-size: 22px;
  text-align: left;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 15px;
  width: 75%;
  color: var(--main-color);
}

.subtitleBox img {
  height: 30px;
}

td {
  width: 25%;
}

tr:last-child {
  color: #888888;
}

.friendsBox,
.statsBox,
.infoBox {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 35vw;
  max-width: 700px;
  min-width: 500px;
  gap: 5px;
}

.statsBox,
.friendsBox {
  gap: 20px;
}

.inviteBtn {
  border: 2px solid var(--main-color);
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-family: "Outfit Bold";
  box-shadow: 0px 0px 4px 3px rgba(0, 0, 0, 0.25);
  border-radius: 22px;
  line-height: 2.3em;
  width: 200px;
  font-size: 22px;
  color: var(--main-color);
  transition: transform 0.5s ease;
  background: none;
}

.inviteBtn:hover {
  cursor: pointer;
  transform: scale(1.1);
}
</style>
