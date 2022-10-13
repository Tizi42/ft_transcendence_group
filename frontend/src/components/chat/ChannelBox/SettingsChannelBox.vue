<template>
  <div class="manage-channel-settings">
    <h2>Channel settings</h2>
    <div class="privacy-settings">
      <ul>
        <li>Actual channel privacy : <span>protected</span></li>
        <li>password : <span>yes</span></li>
        <li>
          <form
            class="update-settings"
            id="change-privacy"
            @submit.prevent="changePrivacy"
          >
            <div id="div-change-privacy">
              <div>
                <label for="options-select">Update channel privacy :</label>
                <select class="options-select" v-model="channelType">
                  <option v-bind:value="'public'">public</option>
                  <option v-bind:value="'private'">private</option>
                  <!-- <option v-bind:value="'protected'">protected</option> -->
                </select>
              </div>
              <!-- <div>
                <label for="input-new-password">Set a password :</label>
                <input
                  class="input-new-password"
                  v-model="newPassword"
                  type="text"
                  placeholder="Your password.."
                />
              </div> -->
            </div>
            <button type="submit" id="update"></button>
          </form>
        </li>
        <li>
          <form
            class="update-settings"
            id="set-new-password"
            @submit.prevent="UpdatePassword"
          >
            <label for="input-new-password">Update password :</label>
            <input
              class="input-new-password"
              v-model="newPassword"
              type="text"
              placeholder="Your new password.."
            />
            <button type="submit" id="update"></button>
          </form>
        </li>
        <li>
          <form class="update-settings" @submit.prevent="AddNewAdmin">
            <label for="options-select">Give administrator role :</label>
            <select class="options-select" v-model="newAdmin">
              <option v-bind:value="'victor'">victor</option>
              <option v-bind:value="'lison'">lison</option>
            </select>
            <button type="submit" id="update"></button>
          </form>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineComponent, defineExpose, Ref } from "vue";

const channelType: Ref<string> = ref("");
const newPassword: Ref<string> = ref("");
const newAdmin: Ref<string> = ref("");

const changePrivacy = () => {
  console.log("new channel type = ", channelType.value);
  console.log("password = ", newPassword.value);
  channelType.value = "";
  newPassword.value = "";
};

const UpdatePassword = () => {
  console.log("Your new password = ", newPassword.value);
  newPassword.value = "";
};

const AddNewAdmin = () => {
  console.log("New admin name = ", newAdmin.value);
  newAdmin.value = "";
};

interface Props {
  user: any;
  selectedChannel: number;
}

defineExpose(
  defineComponent({
    name: "SettingsChannelBox",
  })
);
</script>

<style scoped>
.privacy-settings {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  height: 28vh;
}

span {
  font-weight: bold;
  color: #ffcb00;
}

h2 {
  margin: 0;
  color: #ffcb00;
}

.update-settings {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
}

#div-change-privacy {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#div-change-privacy div {
  padding: 0.5em;
}

.update-settings input,
.options-select {
  margin-left: 5px;
  font-size: 0.8em;
  border: none;
  border-radius: 10px;
  padding: 0.7em;
  background-color: #141817;
  transition: transform 0.5s ease;
}

.update-settings input:hover,
.options-select:hover {
  transform: scale(1.03, 1.03);
}

.update-settings input:focus,
.options-select:focus {
  outline: none;
}

.options-select {
  color: #ffcb00;
  cursor: pointer;
}

.input-new-password {
  color: white;
}

#update {
  background-image: url("@/assets/icons/refresh.svg");
  background-repeat: no-repeat;
  background-size: 35px 35px;
  width: 35px;
  height: 35px;
  border: none;
  fill: none;
  transition: transform 1.5s ease, opacity 1.5s ease;
  background-color: #1e2b02;
  margin-left: 10px;
}

#update:hover {
  transform: scale(1.2, 1.2) rotate(360deg);
  cursor: pointer;
}
</style>
