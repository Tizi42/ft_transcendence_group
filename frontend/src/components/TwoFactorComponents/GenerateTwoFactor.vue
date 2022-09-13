<template>
  <div class="container-generate">
    <h4>Scan this Qr Code to get the<br />6 numbers verification code</h4>
    <img id="QrCode" src="" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount } from "vue";
import "@/assets/styles/authentication.css";

export default defineComponent({
  name: "GenerateTwoFactor",
});
</script>

<script lang="ts" setup>
onBeforeMount(async () => {
  await fetch("http://localhost:3000/api/auth/2fa/generate", {
    method: "POST",
    credentials: "include",
  })
    .then((response) => {
      return response.blob();
    })
    .then((blob: any) => {
      const myImage: any = document.getElementById("QrCode");
      const imageUrl = URL.createObjectURL(blob);
      myImage.src = imageUrl;
    })
    .catch((error) => {
      console.log(error);
    });
});
</script>
