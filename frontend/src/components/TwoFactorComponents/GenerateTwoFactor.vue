<template>
  <div class="container-generate">
    <h4>Scan this Qr Code to get the<br />6 numbers verification code</h4>
    <img id="QrCode" :src="imageUrl" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount } from "vue";
import { Ref, ref } from "vue";
import { getUrlOf } from "@/router";

export default defineComponent({
  name: "GenerateTwoFactor",
});
</script>

<script lang="ts" setup>
const imageUrl: Ref<string> = ref("");

onBeforeMount(async () => {
  await fetch(getUrlOf("api/auth/2fa/generate"), {
    method: "POST",
    credentials: "include",
  })
    .then((response: Response) => {
      return response.blob();
    })
    .then((blob: Blob) => {
      imageUrl.value = URL.createObjectURL(blob);
    })
    .catch((error: Error) => {
      console.log(error);
    });
});
</script>
