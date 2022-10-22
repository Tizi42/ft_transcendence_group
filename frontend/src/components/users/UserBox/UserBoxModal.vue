<template>
  <div class="pageCenter">
    <div class="modalContainer" ref="modal">
      <UserBox
        :target="props.target"
        @statusOn="changeStatus(true)"
        @statusOff="changeStatus(false)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, defineExpose, defineEmits, defineProps } from "vue";
import { Ref, ref } from "vue";
import { useClickOutside } from "@/composables/useClickOutside";
import { User } from "@backend/users/users.entity";
import UserBox from "./UserBox.vue";

interface Props {
  target: User;
  context?: string;
}

const props: Readonly<Props> = defineProps<Props>();
const emit = defineEmits(["hideUserBox"]);
const modal = ref();
const status: Ref<boolean> = ref(false);

function changeStatus(data: boolean) {
  status.value = data;
}

useClickOutside(modal, () => {
  if (!status.value) emit("hideUserBox");
});

defineExpose(
  defineComponent({
    name: "UserBoxModal",
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
  top: 0px;
  left: 0px;
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
  justify-content: space-evenly;
  gap: 15px;
  flex-direction: column;
  padding-top: 2em;
  padding-bottom: 2em;
  width: 35vw;
  background: rgba(30, 42, 2, 1);
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.75);
  border-radius: 58px;
  position: absolute;
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  height: 40vh;
}
</style>
