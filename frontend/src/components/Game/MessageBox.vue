<template>
  <div class="messageBox">{{ message.content }}</div>
</template>

<script lang="ts" setup>
import { defineComponent, defineExpose, defineProps, onBeforeMount } from "vue";
import { userInfoStore } from "@/stores/user";
import { Chat } from "@backend/chat/entities/chat.entity";
import { User } from "@backend/users/Users.entity";

interface Props {
  message: Chat;
  user: userInfoStore;
}
const props: Readonly<Props> = defineProps<Props>();

onBeforeMount(() => {
  const author: User = props.message.author;
  if (author.id == props.user.id.value) {
    console.log("i wrote this");
  }
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
