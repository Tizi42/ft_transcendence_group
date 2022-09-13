<template>
  <div class="option-group">
    <div class="on-off-option" @click="toggle2FA">
      <div class="option">
        Two-factor authentication with Google Authenticator
      </div>
      <img
        v-if="user.enabled2FA"
        id="option-icon-2FA"
        class="on-off"
        src="@/assets/icons/option-on.png"
        alt="option-off"
      />
      <img
        v-else
        id="option-icon-2FA"
        class="on-off"
        src="@/assets/icons/option-off.png"
        alt="option-off"
      />
    </div>
  </div>
  <div class="option-group">
    <div class="option">
      <a href="mailto: feedback@transcendence.42.fr">Send a feedback</a>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, defineComponent, defineExpose } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";

const user = useUserStore();
const router = useRouter();

onBeforeMount(async () => {
  await user.doFetch();
});

async function toggle2FA() {
  if (user.enabled2FA === false) {
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
        user.doFetch();
        console.log("success : ", result);
      })
      .catch((error) => {
        console.log("error : ", error);
      });
  }
}

defineExpose(
  defineComponent({
    name: "AccountOptions",
  })
);
</script>

<style scoped>
.option-group {
  border-top: 1px solid rgba(147, 150, 148, 1);
  margin: 36px 15% 48px 5%;
  padding-right: 2%;
}

.on-off-option {
  display: flex;
}

.on-off {
  align-self: flex-end;
  margin-left: auto;
  object-fit: cover;
  height: 20px;
}

.option {
  font-family: "Outfit";
  font-style: normal;
  font-weight: 500;
  font-size: 22px;
  color: rgba(255, 255, 255, 1);
  margin: 20px 3% 0px 3%;
}

a {
  all: unset;
}

.option:hover,
.on-off-option:hover {
  cursor: pointer;
}
</style>
