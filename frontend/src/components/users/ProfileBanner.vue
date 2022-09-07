<template>
  <div class="profile-frame">
    <div
      class="avatar-frame"
      ref="avatarFrame"
      :style="{ 'background-image': 'url(' + profile.picture + ')' }"
    >
      <div class="upload-overlay" @click="onClickUpload">
        <div class="upload-text">upload🐱</div>
        <input
          type="file"
          accept="image/*"
          ref="avatar"
          id="file"
          @change="onChangeAvatar"
        />
      </div>
    </div>
    <div class="personal-info-frame">
      <p v-if="!editingMode" id="info-name">
        {{ profile.displayName }}
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
      <p id="info-id">&nbsp;user_id: {{ profile.id }}</p>
      <p id="info-email">&nbsp;{{ profile.email }}</p>
    </div>
    <button v-if="!editingMode" class="edit-button" @click="editProfile">
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
import {
  ref,
  defineComponent,
  defineExpose,
  defineProps,
  onBeforeMount,
} from "vue";
import axios from "axios";

const props = defineProps(["profile"]);

const avatar = ref();
const reader = new FileReader();
const editingMode = ref(false);
let avatarFrame = ref();
let newname = ref("");
// let user = ref();

// onBeforeMount(async () => {
//   console.log("id is " + props.profile.id);
//   await axios
//     .get("http://localhost:3000/api/users/" + props.id)
//     .then(function (response) {
//       console.log(response.data);
//     });
//   user.value = props.profile;
//   console.log("user is : " + user.value);
// });

function onClickUpload() {
  console.log(avatar.value);
  avatar.value.click();
}

function onChangeAvatar() {
  console.log(avatar.value.files[0]);
  const image = avatar.value.files[0];
  let formdata = new FormData();

  formdata.append("file", image);
  axios.put(
    "http://localhost:3000/api/users/uploads/avatar/" + props.profile.id,
    formdata,
    {
      headers: {
        id: props.profile.id,
      },
    }
  );
  if (image) reader.readAsDataURL(image);
}

reader.addEventListener(
  "load",
  function () {
    avatarFrame.value.style.backgroundImage = `url(${reader.result})`;
  },
  false
);

function editProfile() {
  newname.value = props.profile.displayName;
  editingMode.value = !editingMode.value;
}

function onSubmit() {
  if (newname.value === "") return;
  editingMode.value = false;
  if (newname.value !== props.profile.displayname) {
    axios.post(
      "http://localhost:3000/api/users/info/3?displayname=" + newname.value
    );
  }
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
.avatar-frame {
  display: inline-block;
  border-radius: 100%;
  background-position: center;
  background-size: cover;
  width: 223px;
  height: 223px;
  margin-left: 5%;
  margin-right: 8%;
  top: 50px;
}

.upload-overlay {
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: 100%;
  height: 100%;
  width: 100%;
  opacity: 0;
  transition: 0.2s ease;
  background-color: rgba(30, 42, 2, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed rgba(255, 203, 0, 1);
}

.upload-text {
  padding: 10px;
  font-family: "Outfit";
  font-style: normal;
  font-size: 30px;
  font-weight: regular;
  color: rgba(255, 203, 0, 1);
  background: none;
}

input[type="file"] {
  display: none;
}

.avatar-frame:hover .upload-overlay {
  opacity: 1;
  cursor: pointer;
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
  font-size: 52px;
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
