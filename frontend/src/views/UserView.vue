<template>
  <div class="about">
    <h1>Hey {{ profile.username }}</h1>
    <ul>
      <li><span>Id : </span>{{ profile.id }}</li>
      <li><span>Email : </span>{{ profile.email }}</li>
      <li><span>Display Name : </span>{{ profile.displayName }}</li>
      <li>
        <span>Picture profile : </span>
        <img :src="profile.picture" width="100" />
      </li>
    </ul>
    <label for="button2FA">
      <span v-if="enabled2FA">2FA on</span>
      <span v-else>2FA off</span>
      <input
        type="checkbox"
        id="button2FA"
        v-model="enabled2FA"
        @click="toggle2FA()"
      />
    </label>
  </div>
</template>

<script lang="ts" setup>
import { Ref, ref, onBeforeMount } from "vue";
import { useRouter } from "vue-router";

const profile: Ref<any> = ref("");
const router = useRouter();
const enabled2FA = ref(false);

onBeforeMount(async () => {
  await fetch("http://localhost:3000/api/private", {
    credentials: "include",
  })
    .then((response) => {
      if (response.status != 200) {
        router.push({
          name: "login",
        });
        return response.json();
      }
      return response.json();
    })
    .then((user) => {
      profile.value = user;
      enabled2FA.value = profile.value.isTwoFactorAuthenticationEnabled;
    })
    .catch((error) => {
      console.log(error);
    });
});

async function toggle2FA() {
  if (enabled2FA.value === false) {
    router.push({
      name: "2FA",
    });
  } else {
    await fetch("http://localhost:3000/api/auth/2fa/turn-off", {
      credentials: "include",
    })
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        console.log("success : ", result);
      })
      .catch((error) => {
        console.log("error : ", error);
      });
  }
}
</script>

<style>
.about {
  color: white;
}

li {
  list-style: none;
}
</style>
