<template>
  <div class="about">
    <h1>This is the CHAT page</h1>
    <p>Test image for avatar sync after uploading a new one:</p>
    <img :src="user.avatarUrl + `?_=${+new Date()}`" />
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from "@/stores/user";

const user = useUserStore();
</script>
