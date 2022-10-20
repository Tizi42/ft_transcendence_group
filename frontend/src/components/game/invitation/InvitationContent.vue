<template>
  <div id="choosing" v-if="!sent">
    <Transition name="bounce" appear>
      <div class="popUpContent">
        <div class="popUpTxt">Nomral mode</div>
        <div class="popUpTxt">Magic mode</div>
        <div class="popUpTxt">Speed mode</div>
        <div class="cancelBtn" @click="send">Send</div>
      </div>
    </Transition>
  </div>
  <div id="waiting" v-if="sent && !refused">
    <Transition name="bounce" appear>
      <div class="popUpContent">
        <div class="popUpTxt">Waiting for friend to accept...</div>
        <LoadingRing color="#ffcb00" size="50px" height="50px" />
        <div class="cancelBtn" @click="cancel">Cancel</div>
      </div>
    </Transition>
  </div>
  <div id="refused" v-if="refused">
    <Transition name="bounce" appear>
      <div class="popUpContent">
        <div class="popUpTxt">
          Your friend has turned down your invitation 😞
        </div>
        <div class="cancelBtn" @click="hide">Okay</div>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, defineExpose, defineProps, defineEmits } from "vue";
import { ref } from "vue";
import "@/assets/styles/gameOverlay.css";
import LoadingRing from "../../utils/LoadingRing.vue";
import { useUserStore } from "../../../stores/user";

const user = useUserStore();
const emit = defineEmits(["hideInvitation"]);
const props = defineProps(["friend"]);
const sent = ref(false);
const refused = ref(false);

function send() {
  sent.value = true;
}

function cancel() {
  // socket.emit(
  //   "quit_queue",
  //   {
  //     mode: "normal", //later: change to choosen mode
  //     user_id: user.id,
  //   },
  //   (data: any) => {
  //     console.log(data);
  //   }
  // );
  setTimeout(() => {
    refused.value = true;
  }, 3000);
}

function hide() {
  emit("hideInvitation");
}

defineExpose(
  defineComponent({
    name: "InvitationContent",
  })
);
</script>
