<template>
</template>

<script lang="ts" setup>
import {
  defineComponent,
  defineExpose,
  defineProps,
  onBeforeMount,
  defineEmits,
  ref,
  Ref,
} from "vue";
import socket from "@/socket";
import { userInfoStore } from "@/stores/user";

interface Props {
}

const props: Readonly<Props> = defineProps<Props>();
const channel: Ref<any> = ref();
const password: Ref<string> = ref("");
const authorized: Ref<boolean> = ref(false);
let inputBorder = ref("none");
