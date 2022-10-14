<template>
  <div class="manage-members-list">
    <h1>{{ channel.name }}</h1>
    <div>
      <ul>
        <li></li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineComponent, defineExpose, Ref, defineProps } from "vue";

interface Props {
  channel: any;
}

const props: Readonly<Props> = defineProps<Props>();

const showChannel = () => {
  console.log("props channel = ", props.channel.name);
};

defineExpose(
  defineComponent({
    name: "MembersListBox",
  })
);
</script>
