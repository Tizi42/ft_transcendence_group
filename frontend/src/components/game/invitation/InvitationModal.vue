<template>
  <div class="pageCenter">
    <div class="modalContainer" ref="modal">
      <InvitationContent
        @hideInvitation="$emit('hideInvitation')"
        @sending="changeStatus(true)"
        @cancel="changeStatus(false)"
        :friend="props.friend"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, defineExpose, defineProps, defineEmits } from "vue";
import { Ref, ref } from "vue";
import { useClickOutside } from "@/composables/useClickOutside";
import InvitationContent from "../../game/invitation/InvitationContent.vue";
import { User } from "@backend/users/users.entity";

interface Props {
  friend: User;
}

const props: Readonly<Props> = defineProps<Props>();
const emit = defineEmits(["hideInvitation"]);
const modal = ref();
const sending: Ref<boolean> = ref(false);

function changeStatus(status: boolean) {
  sending.value = status;
}

useClickOutside(modal, () => {
  if (!sending.value) emit("hideInvitation");
});

defineExpose(
  defineComponent({
    name: "SimpleModal",
  })
);
</script>

<style scoped>
.pageCenter {
  cursor: default;
  position: fixed;
  display: flex;
  align-items: center;
  flex-direction: column;
  z-index: 997;
  width: 100vw;
  height: 100vh;
  background-color: #ffffff44;
  font-family: "Outfit";
  font-size: 18px;
  gap: 15px;
  color: #ffffff;
}

.modalContainer {
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: space-between;
  flex-direction: column;
  width: 30vw;
  min-width: 400px;
  background: #1e2a02;
  box-shadow: 0px 0px 8px #000000bf;
  border-radius: 58px;
  position: absolute;
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  height: 350px;
}
</style>
