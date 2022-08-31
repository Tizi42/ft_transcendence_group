<template>
  <ProfileBanner :profile="profile" />
  <div class="users-navbar-frame">
    <ul id="users-navbar-list">
      <li>STATS</li>
      <li>FRIENDS</li>
      <li>SETTINGS</li>
    </ul>
  </div>
</template>

<script lang="ts">
import ProfileBanner from "@/components/users/ProfileBanner.vue";

export default defineComponent({
  name: "UserView",
  components: {
    ProfileBanner,
  },
});
</script>

<script lang="ts" setup>
import { Ref, ref, onBeforeMount, defineComponent } from "vue";
import { useRouter } from "vue-router";

const profile: Ref<any> = ref("");
const router = useRouter();

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
    })
    .catch((error) => {
      console.log(error);
    });
});
</script>

<style>
#users-navbar-list {
  list-style-type: none;
  margin-top: 375px;
  padding: 0;
  display: flex;
  flex-direction: row;
}

#users-navbar-list li {
  font-family: "Outfit";
  font-style: normal;
  font-weight: 600;
  font-size: 28px;
  line-height: 35px;

  display: inline-block;
  margin: 0px 38px;
  color: rgba(255, 255, 255, 1);
}
</style>
