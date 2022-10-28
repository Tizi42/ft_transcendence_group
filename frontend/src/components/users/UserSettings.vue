<template>
  <div class="settings">
    <div class="setting-navbar">
      <div class="setting-navbar-item">Account</div>
      <div class="setting-navbar-item">Privacy</div>
      <div class="setting-navbar-item">Blocked Users</div>
    </div>
    <div class="setting-field">
      <div class="option-group">
        <div class="on-off-option" @click="toggle2FA">
          <div class="option">
            Two-factor authentication with Google Authenticator
          </div>
          <img
            v-if="user.enabled2FA"
            id="option-icon-2FA"
            class="on-off"
            src="@/assets/option-on.png"
            alt="option-off"
          />
          <img
            v-else
            id="option-icon-2FA"
            class="on-off"
            src="@/assets/option-off.png"
            alt="option-off"
          />
        </div>
        <div class="on-off-option">
          <div class="option">Allow popaup notifications</div>
          <img class="on-off" src="@/assets/option-on.png" alt="option-on" />
        </div>
      </div>
      <div class="option-group">
        <div class="option">Send a feedback</div>
      </div>
      <div class="option-group">
        <div class="option">Erase match history</div>
        <div class="option">Reset account</div>
        <div class="option">Delete account</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, defineComponent, defineExpose } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import { getUrlOf } from "@/router";
import { StoreGeneric } from "pinia";

const user: StoreGeneric = useUserStore();
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
    await fetch(getUrlOf("api/auth/2fa/turn-off"), {
      credentials: "include",
    })
      .then((response: Response) => {
        return response.json();
      })
      .then(() => {
        user.doFetch();
      });
  }
}

defineExpose(
  defineComponent({
    name: "UserSetting",
  })
);
</script>

<style scoped>
.settings {
  display: flex;
  margin-bottom: 25px;
}
.setting-navbar {
  margin-left: 7%;
  margin-right: 1%;
  align-items: left;
  width: 20%;
  text-align: left;
}

.setting-navbar-item {
  font-family: "Outfit";
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  line-height: 1.2;
  color: rgba(255, 255, 255, 1);
  background-color: rgba(20, 29, 1, 1);
  padding: 18px;
}

.setting-navbar-item:hover {
  cursor: pointer;
}

.setting-field {
  flex: 1;
  margin-right: 7%;
  height: 545px;
  overflow: scroll;
  background-color: rgba(20, 29, 1, 1);
  text-align: left;
  display: flex;
  flex-direction: column;
}

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

.option:hover {
  cursor: pointer;
}
</style>
