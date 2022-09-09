<template>
  <div class="profile-frame">
    <ProfileAvatar />
    <div class="personal-info-frame">
      <p v-if="!editingMode" id="info-name">
        {{ user.displayName }}
      </p>
      <form v-if="editingMode" id="info-form" @submit.prevent="onSubmit">
        <input
          v-model="newname"
          class="input-textarea"
          type="text"
          required="true"
          autofocus
        />
      </form>
      <p id="info-id">&nbsp;user_id: {{ user.id }}</p>
      <p id="info-email">&nbsp;{{ user.email }}</p>
    </div>
    <button v-if="!editingMode" class="edit-button" @click="onClickEdit">
      edit
    </button>
    <button
      v-if="editingMode"
      class="edit-button"
      form="info-form"
      @click="onSubmit"
    >
      save
    </button>
  </div>
</template>

<script lang="ts" setup defer>
import { ref, defineComponent, defineExpose } from "vue";
import axios from "axios";
import { useUserStore } from "@/stores/user";
import ProfileAvatar from "./ProfileAvatar.vue";

const user = useUserStore();
const editingMode = ref(false);
let newname = "";

function onClickEdit() {
  newname = user.displayName;
  editingMode.value = !editingMode.value;
}

function onSubmit() {
  if (newname === "") return;
  editingMode.value = false;
  if (newname !== user.displayName) {
    axios.post("http://localhost:3000/api/users/info/3?displayname=" + newname);
  }
  user.doFetch();
}

defineExpose(
  defineComponent({
    name: "ProfileBanner",
  })
);
</script>

<style scoped>
.profile-frame {
  width: 86%;
  padding-top: 50px;
  padding-bottom: 50px;
  margin-left: 7%;
  margin-right: 7%;
  margin-top: 25px;
  background-color: rgba(20, 29, 1, 1);
  display: flex;
}

.personal-info-frame {
  text-align: left;
  align-self: flex-end;
  padding-bottom: 37px;
  flex: 1;
}

#info-name {
  text-align: left;
  font-family: "Outfit";
  font-style: normal;
  font-weight: bold;
  font-size: 50px;
  line-height: 1.2;
  color: rgba(255, 255, 255, 1);
  margin: 0;
}

#info-email,
#info-id {
  text-align: left;
  font-family: "Outfit";
  font-style: normal;
  font-weight: light;
  font-size: 24px;
  line-height: 1.2;
  margin: 0;
  color: rgba(255, 255, 255, 1);
}

#info-id {
  margin-top: 20px;
}

.input-textarea {
  font-family: "Outfit";
  font-size: 42px;
  color: rgba(30, 42, 2, 0.8);
}

.edit-button {
  align-self: flex-end;
  position: relative;
  top: 38px;
  right: 10px;
  padding: 5px;
  padding-left: 16px;
  padding-right: 16px;
  border: none;
  font-family: "Outfit";
  font-style: normal;
  font-weight: light;
  font-size: 20px;
  color: rgba(255, 255, 255, 0.7);
  background-color: rgba(30, 42, 2, 0.7);
}

.edit-button:hover {
  background-color: rgba(255, 203, 0, 0.7);
  cursor: pointer;
}
</style>
