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
      <p id="info-name">{{ profile.displayName }}</p>
      <p id="info-id">&nbsp;&nbsp;user_id: {{ profile.id }}</p>
      <p id="info-email">&nbsp;&nbsp;{{ profile.email }}</p>
    </div>
    <button class="edit-button" @click="editProfile">edit</button>
  </div>
</template>

<script lang="ts" setup defer>
import {
  ref,
  defineComponent,
  defineExpose,
  defineProps,
  onMounted,
} from "vue";
import axios from "axios";

const props = defineProps(["profile"]);
console.log(props);

const avatar = ref(null);
let avatarFrame = ref(null);
const reader = new FileReader();

function onClickUpload() {
  console.log(avatar.value);
  avatar.value.click();
}

function onChangeAvatar() {
  console.log(avatar.value.files[0]);
  const image = avatar.value.files[0];
  let formdata = new FormData();

  console.log(
    "name is http://localhost:3000/api/users/uploads/avatar/" + props.profile.id
  );
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
    console.log("here");
    avatarFrame.value.style.backgroundImage = `url(${reader.result})`;
  },
  false
);

function editProfile() {
  console.log("edit button clicked");
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