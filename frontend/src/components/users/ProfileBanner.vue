<template>
  <div class="profile-frame">
    <div
      class="avatar-frame"
      :style="{ 'background-image': 'url(' + profile.picture + ')' }"
    ></div>
    <div class="personal-info-frame">
      <p id="info-name">{{ profile.displayName }}</p>
      <p id="info-id">&nbsp;user_id: {{ profile.id }}</p>
      <p id="info-email">&nbsp;{{ profile.email }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ProfileBanner",
  props: {
    profile: Object,
  },
});
</script>

<style scoped>
.profile-frame {
  position: absolute;
  display: flex;
  width: 1236px;
  height: 323px;
  left: 102px;
  top: 25px;
  background-color: rgba(255, 203, 0, 1);
}

.avatar-frame {
  border-radius: 100%;
  background-position: center;
  background-size: cover;
  position: absolute;
  width: 223px;
  height: 223px;
  left: 56px;
  top: 50px;
}

.personal-info-frame {
  position: absolute;
  left: 374px;
  top: 87px;
  text-align: left;
}

#info-name {
  font-family: "Outfit";
  font-style: normal;
  font-weight: 700;
  font-size: 52px;
  line-height: 66px;
  color: rgba(255, 255, 255, 1);
  margin: 0;
}

#info-email,
#info-id {
  font-family: "Outfit";
  font-style: normal;
  font-weight: 300;
  font-size: 26px;
  line-height: 33px;
  margin: 0;
  color: rgba(255, 255, 255, 1);
}

#info-id {
  margin-top: 36px;
}
</style>
