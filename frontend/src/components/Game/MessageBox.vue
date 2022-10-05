<template>
  <div class="messageBox left" v-if="iWrotehis">{{ message }}</div>
  <div class="messageBox right" v-else>{{ message }}</div>
</template>

<script lang="ts" setup>
import { defineComponent, defineExpose, defineProps } from "vue";
import { onBeforeMount, onUpdated } from "vue";
import { ref, Ref } from "vue";
import { userInfoStore } from "@/stores/user";
import { User } from "@backend/users/users.entity";

interface Props {
  message: string;
  author: User;
  dest: User;
  user: userInfoStore;
}

const props: Readonly<Props> = defineProps<Props>();
const iWrotehis: Ref<boolean> = ref(false);

onBeforeMount(async () => {
  if (props.author.id == props.user.id.value) {
    iWrotehis.value = true;
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

.left {
  left: 0px;
}

.right {
  right: 0px;
}
</style>
