<template>
  <div class="userBox">
    <TransitionGroup :name="transition">
      <div
        v-for="(item, index) in items"
        :key="item"
        :class="getClassOf(index)"
      >
        {{ item }}
      </div>
    </TransitionGroup>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, defineExpose, defineProps } from "vue";
import { onBeforeMount, onUpdated } from "vue";
import { Ref, ref } from "vue";
import { UserMinimal } from "@/components/utils/UserMinimal";
import { messageInGame } from "@backend/chat/utils/types";

interface Props {
  user: UserMinimal;
  message: messageInGame | null;
  transition: string;
  align: string;
}

const props: Readonly<Props> = defineProps<Props>();
const items: Ref<Array<string>> = ref([
  smallDisplayName(props.user.displayName),
]);

function smallDisplayName(displayName: string): string {
  let small = displayName.split(" ")[0].slice(0, 10);
  if (small.length > 10) return small + ".";
  return small;
}

onBeforeMount(() => {
  if (props.message == null) return;
  addItem(props.message.content);
});

function remove(item: string) {
  const i = items.value.indexOf(item);
  if (i > -1) {
    items.value.splice(i, 1);
  }
}

function getClassOf(key: number): string {
  if (key > 0) return "chatItems";
  return "nameUser";
}

function addItem(item: string) {
  items.value.push(item);
  setTimeout(() => {
    remove(item);
  }, 6000);
}

onUpdated(() => {
  if (props.message == null || items.value.length > 2) return;
  let content = props.message.content;
  addItem(content);
});

defineExpose(
  defineComponent({
    name: "UserChat",
  })
);
</script>

<style scoped>
.userBox {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: v-bind(align);
  height: 20%;
  width: 100%;
}

.chatItems {
  width: fit-content;
  display: block;
  font-size: 15px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 14px;
  padding: 10px;
  margin-top: 10px;
}
</style>
