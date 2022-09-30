<template>
  <div class="nav-channels">
    <button
      id="players-col"
      :class="{ selected: isActive === 'players' }"
      @click="select('players')"
    >
      Players
    </button>
    <button
      id="channels-col"
      :class="{ selected: isActive === 'channels' }"
      @click="select('channels')"
    >
      Channels
    </button>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, ref, Ref } from 'vue';
import "@/assets/styles/chat.css";

const isActive: Ref<string> = ref("players");
const receiver: Ref<number> = ref(-1);
const history: Ref<any> = ref([]);

const select = (id: string) => {
  isActive.value = id;
  receiver.value = -1;
  history.value = [];
  emit('selectedNav', isActive.value);
  emit('resetReceiver', -1);
  emit('clearHistory', []);
};

const emit = defineEmits([
  'selectedNav',
  'resetReceiver',
  'clearHistory'
]);

defineExpose(
  defineComponent({
    name: "NavChat",
  })
);
</script>
