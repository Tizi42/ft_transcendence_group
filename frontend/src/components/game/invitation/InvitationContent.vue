<template>
  <div class="content" v-if="!sent">
    <Transition name="bounce" appear>
      <div class="popUpInvite">
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
    </Transition>
  </div>
  <div class="content" v-if="sent && !refused && !tooLong">
    <Transition name="bounce" appear>
      <div class="popUpInvite">
        <div class="popUpTxt">Waiting for friend to accept...</div>
        <LoadingRing color="#ffcb00" size="50px" height="50px" />
        <div class="cancelBtn" @click="cancel()">Cancel</div>
      </div>
    </Transition>
  </div>
  <div class="content" v-if="sent && refused">
    <Transition name="bounce" appear>
      <div class="popUpInvite">
        <div class="popUpTxt">
          Your friend has turned down your invitation &#128542;
        </div>
        <div class="cancelBtn" @click="hide()">Okay...</div>
      </div>
    </Transition>
  </div>
  <div class="content" v-if="sent && tooLong">
    <Transition name="bounce" appear>
      <div class="popUpInvite">
        <div class="popUpTxt">Your friend did not answer in time &#128542;</div>
        <div class="cancelBtn" @click="hide()">Okay...</div>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, defineExpose, defineProps, defineEmits } from "vue";
import { ref, Ref, onBeforeMount } from "vue";
import "@/assets/styles/gameOverlay.css";
import LoadingRing from "@/components/utils/LoadingRing.vue";
import socket from "@/socket";
import { useUserStore } from "@/stores/user";
import { StoreGeneric } from "pinia";
import { User } from "@backend/users/users.entity";
import router from "@/router";

interface Props {
  friend: User;
}

const props: Readonly<Props> = defineProps<Props>();
const user: StoreGeneric = useUserStore();
const emit = defineEmits(["hideInvitation", "sending", "cancel"]);
const sent = ref(false);
const refused = ref(false);
const tooLong = ref(false);
const choosenMode: Ref<string> = ref("normal");
const lastSending: Ref<Date> = ref(new Date());

function send() {
  emit("sending");
  lastSending.value = new Date();
  sent.value = true;
  tooLong.value = false;
  socket.emit("send_invitation", {
    mode: choosenMode.value,
    user_id: user.id,
    invitee: props.friend.id,
  });
  setTimeout(() => {
    if (new Date().getTime() - lastSending.value.getTime() > 29900)
      cancelTooLong();
  }, 30000);
}

function cancelTooLong() {
  tooLong.value = true;
  cancel();
}

function hideAfterTime() {
  setTimeout(() => {
    sent.value = false;
    console.log("hide call");
    hide();
  }, 3000);
}

function cancel() {
  emit("cancel");
  socket.emit("cancel_invitation", {
    user_id: user.id,
    invitee: props.friend.id,
  });
  hideAfterTime();
}

function hide() {
  emit("hideInvitation");
}

onBeforeMount(() => {
  socket.on("decline_invitation", () => {
    refused.value = true;
    hideAfterTime();
  });
  socket.on("go_play", (roomName: string) => {
    router.push({ name: "pong", params: { room_name: roomName } });
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
</style>
