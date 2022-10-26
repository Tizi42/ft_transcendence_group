<template>
  <div class="nav-channels">
    <button
      id="players-col"
      :class="{ selected: isActive === 'players' }"
      @click="select('players')"
    >
      Players
      <div v-if="user.pendingMsgList.length > 0" class="red-point">x</div>
    </button>
    <button
      id="channels-col"
      :class="{ selected: isActive === 'channels' }"
      @click="select('channels')"
    >
      Channels
      <div v-if="user.pendingMsgChannel.length > 0" class="red-point">x</div>
    </button>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from "@/stores/user";
import { Chat } from "@backend/chat/entities/chat.entity";
import { StoreGeneric } from "pinia";
import { defineComponent, ref, Ref, defineEmits, defineExpose } from "vue";

const user: StoreGeneric = useUserStore();
const isActive: Ref<string> = ref("players");
const receiver: Ref<number> = ref(-1);
const history: Ref<Chat[]> = ref([]);
const emit = defineEmits(["selectedNav", "resetReceiver", "clearHistory"]);

const select = (id: string) => {
  isActive.value = id;
  receiver.value = -1;
  history.value = [];
  emit("selectedNav", isActive.value);
  emit("resetReceiver", -1);
  emit("clearHistory", []);
};

defineExpose(
  defineComponent({
    name: "NavChat",
  })
);
</script>
