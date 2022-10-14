<template>
  <h1 @click="showChannel">test</h1>
</template>

<script lang="ts" setup>
import { getUrlOf } from "@/router";
import {
  ref,
  defineComponent,
  defineExpose,
  Ref,
  defineProps,
  watch,
} from "vue";

interface Props {
  channel: Array<any>;
}

const props: Readonly<Props> = defineProps<Props>();
const channelInfo: Ref<any> = ref("");

const showChannel = () => {
  console.log("props channel = ", props.channel[0].name);
};

defineExpose(
  defineComponent({
    name: "MembersListBox",
  })
);
</script>
