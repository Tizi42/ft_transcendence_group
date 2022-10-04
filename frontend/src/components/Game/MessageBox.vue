<template>
  <div class="messageBox">{{ message }}</div>
</template>

<script lang="ts" setup>
import { defineComponent, defineExpose, defineProps } from "vue";
import { onBeforeMount, onUpdated } from "vue";
import { ref, Ref } from "vue";
import { userInfoStore } from "@/stores/user";
import { User } from "@backend/src/users/Users.entity";

interface Props {
  message: string;
  author: User;
  dest: User;
  user: userInfoStore;
}

const props: Readonly<Props> = defineProps<Props>();
const iWrote: Ref<boolean> = ref(false);
const show: Ref<boolean> = ref(false);

onBeforeMount(async () => {
  if (props.author.id == props.user.id.value) {
    iWrote.value = true;
  }
});

onUpdated(() => {
  console.log("updated");
});

defineExpose(
  defineComponent({
    name: "MessageBox",
  })
);
</script>

<style scoped>
.messageBox {
  position: fixed;
}
</style>
