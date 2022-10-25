<template>
  <div
    class="avatar-frame"
    ref="avatarFrame"
    :style="{
      'background-image': 'url(' + user.avatarUrl + `?_=${+new Date()}` + ')',
    }"
  >
    <div class="upload-overlay" @click="onClickFrame">
      <div class="upload-text">upload🐱</div>
      <input
        type="file"
        accept="image/*"
        ref="upload"
        id="file"
        @change="onChangeAvatar"
      />
    </div>
  </div>
</template>

<script lang="ts" setup defer>
import { ref, defineComponent, defineExpose } from "vue";
import axios from "axios";
import { useUserStore } from "@/stores/user";

const user = useUserStore();
const upload = ref();
const reader = new FileReader();
const avatarFrame = ref();

function onClickFrame() {
  console.log(upload.value);
  upload.value.click();
}

function onChangeAvatar() {
  console.log(upload.value.files[0]);
  const image = upload.value.files[0];
  let formdata = new FormData();

  formdata.append("file", image);
  axios
    .put("http://10.11.4.13:3000/api/users/uploads/avatar/", formdata, {
      withCredentials: true,
    })
    .then((res) => {
      console.log(res);
    });
  if (image) reader.readAsDataURL(image);
}

reader.addEventListener(
  "load",
  function () {
    avatarFrame.value.style.backgroundImage = `url(${reader.result})`;
  },
  false
);

defineExpose(
  defineComponent({
    name: "ProfileAvatar",
  })
);
</script>

<style scoped>
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
  border: 3px solid rgba(255, 203, 0, 1);
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
</style>
