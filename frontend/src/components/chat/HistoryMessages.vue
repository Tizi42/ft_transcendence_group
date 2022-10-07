<template>
  <div v-if="target === null && isActive === 'players'" class="welcome-chat">
    <img src="@/assets/icons/multiBubble.svg" />
    <h1>Let's chat</h1>
  </div>
  <div class="container-messages" v-else>
    <div v-for="message in history" :key="message">
      <div
        v-if="message.author.id != user.id"
        class="messages"
        id="from-others"
      >
        <img :src="message.author.picture" @click="showInfoBox" />
        <p>{{ message.content }}</p>
      </div>
      <div class="messages" id="from-user" v-else>
        <img :src="message.author.picture" />
        <p>{{ message.content }}</p>
      </div>
    </div>
  </div>
  <teleport to="body">
    <UserBoxModal v-if="addWindow" @hide="hide">
      <UserBox :target="target" />
    </UserBoxModal>
  </teleport>
</template>

<script lang="ts" setup>
import { useUserStore } from "@/stores/user";
import { defineComponent, defineProps, defineExpose, Ref, ref } from "vue";
import UserBoxModal from "../users/UserBox/UserBoxModal.vue";
import UserBox from "../users/UserBox/UserBox.vue";
import { User } from "@backend/users/users.entity";

interface Props {
  history: Array<any>;
  target: Ref<User>;
  isActive: string;
}

const props: Readonly<Props> = defineProps<Props>();
const user: any = useUserStore();
const addWindow: Ref<boolean> = ref(false);

function showInfoBox() {
  addWindow.value = true;
}

function hide() {
  addWindow.value = false;
}

defineExpose(
  defineComponent({
    name: "HistoryMessages",
  })
);
</script>
