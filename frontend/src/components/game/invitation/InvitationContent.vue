<template>
  <div class="content">
    <TransitionGroup name="fadeGroup" appear>
      <div class="popUpInvite" v-if="!sent">
        <div class="selectMenu">
          <label class="labelMode">Choose game mode :</label>
          <select class="selectMode" v-model="choosenMode">
            <option value="normal">Normal mode</option>
            <option value="magic">Magic mode</option>
            <option value="speed">Speed mode</option>
          </select>
        </div>
        <div class="cancelBtn" @click="send()">Send</div>
      </div>
      <div class="popUpInvite" v-if="sent && !refused">
        <div class="popUpTxt">Waiting for opponent to accept...</div>
        <LoadingRing color="#ffcb00" size="50px" height="50px" />
        <div class="cancelBtn" @click="cancelClick()">Cancel</div>
      </div>
      <div class="popUpInvite" v-if="sent && refused">
        <div class="popUpTxt">{{ refusedMsg }} &#128542;</div>
        <div class="cancelBtn" @click="hide()">Okay...</div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, defineExpose, defineProps, defineEmits } from "vue";
import { ref, Ref, onBeforeMount } from "vue";
import { useUserStore } from "@/stores/user";
import { StoreGeneric } from "pinia";
import { User } from "@backend/users/users.entity";
import router from "@/router";
import socket from "@/socket";
import LoadingRing from "@/components/utils/LoadingRing.vue";

interface Props {
  friend: User;
}

const props: Readonly<Props> = defineProps<Props>();
const user: StoreGeneric = useUserStore();
const emit = defineEmits(["hideInvitation", "sending", "cancel"]);
const sent: Ref<boolean> = ref(false);
const refused: Ref<boolean> = ref(false);
const choosenMode: Ref<string> = ref("normal");
const lastSending: Ref<Date> = ref(new Date());
const refusedMsg: Ref<string> = ref("");

function send() {
  emit("sending");
  lastSending.value = new Date();
  sent.value = true;
  refused.value = false;
  socket.emit("send_invitation", {
    mode: choosenMode.value,
    user_id: user.id,
    invitee: props.friend.id,
  });
  setTimeout(() => {
    if (new Date().getTime() - lastSending.value.getTime() > 29000)
      cancelTooLong();
  }, 30000);
}

function cancelTooLong() {
  refused.value = true;
  refusedMsg.value = "Your opponent did not answer in time";
  cancel();
  hideAfterTime();
}

function hideAfterTime() {
  setTimeout(() => {
    sent.value = false;
    hide();
  }, 5000);
}

function cancel() {
  emit("cancel");
  socket.emit("cancel_invitation", {
    user_id: user.id,
    invitee: props.friend.id,
  });
}

function cancelClick() {
  cancel();
  sent.value = false;
}

function hide() {
  emit("hideInvitation");
}

onBeforeMount(() => {
  socket.on("decline_invitation", () => {
    refused.value = true;
    refusedMsg.value = "Your opponent has turned down your invitation";
    hideAfterTime();
  });
  socket.on("go_play", (roomName: string) => {
    router.push({ name: "pong", params: { room_name: roomName } });
  });
  socket.on("unavailable", () => {
    refused.value = true;
    refusedMsg.value = "You or your opponent is unavailable";
    hideAfterTime();
  });
  socket.on("not_allowed", () => {
    refused.value = true;
    refusedMsg.value =
      "Your opponent did not allow invitations from all players";
    hideAfterTime();
  });
});

defineExpose(
  defineComponent({
    name: "InvitationContent",
  })
);
</script>

<style scoped>
.selectMenu {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-evenly;
  gap: 15px;
  font-size: 24px;
}

.selectMode {
  padding: 1em;
  text-align: center;
  border-radius: 12px;
  outline: none;
  border: none;
  background-color: #00000077;
  color: #bebebe;
  font-size: 16px;
  font-family: "Outfit";
}

.selectMenu:hover,
.selectMode:hover {
  cursor: pointer;
}

.content {
  height: 100%;
  width: 100%;
  position: relative;
}

.popUpInvite {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 30px;
  align-items: center;
}

.popUpTxt {
  width: 60%;
  word-wrap: break-word;
  line-height: 1.4em;
}
</style>
