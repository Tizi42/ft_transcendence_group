<template>
  <div class="container-messages">
    <div v-for="message in historyMessages" :key="message">
      <div
        class="messages"
        id="from-others"
        v-if="message.authorId != user.id"
      >
        <img :src="message.dest.picture" />
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
import { useUserStore } from '@/stores/user';
import { defineComponent } from 'vue';

const user: any = useUserStore();

interface Props {
  historyMessages: Array<any>;
}

defineProps<Props>();

defineExpose(
  defineComponent({
    name: "HistoryMessages",
  })
);
</script>
