<template>
  <div class="tableContent">
    <TransitionGroup name="list" tag="ul">
      <li v-for="battle in items" :key="battle">
        {{ battle.date_start }}
      </li>
    </TransitionGroup>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, defineExpose, defineProps } from "vue";
import { onMounted } from "vue";
import { ref } from "vue";

const props = defineProps(["battles"]);
const items = ref([]);
console.log(props);

onMounted(async () => {
  for await (const [key, item] of props.battles.entries()) {
    setTimeout(() => {
      items.value.push(item);
    }, 200 * key);
  }
});

defineExpose(
  defineComponent({
    name: "ContentHistory",
  })
);
</script>

<style scoped>
li {
  margin-top: 30px;
  margin-bottom: 30px;
}

.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-leave-active {
  position: absolute;
}

.tableContent {
  padding-left: 30px;
  padding-right: 30px;
}
</style>
