<template>
  <div class="container-messages">
    <div v-for="message in history" :key="message">
      <div v-if="message.author.id != user.id" class="messages" id="from-others">
        <img :src="message.author.picture" />
        <p>{{ message.content }}</p>
      </div>
      <div class="messages" id="from-user" v-else>
        <img :src="message.author.picture" />
        <p>{{ message.content }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from "@/stores/user";
import { defineComponent, defineProps, defineExpose } from "vue";

const user: any = useUserStore();

interface Props {
  history: Array<any>;
}

defineProps<Props>();

defineExpose(
  defineComponent({
    name: "HistoryMessages",
  })
);
</script>
