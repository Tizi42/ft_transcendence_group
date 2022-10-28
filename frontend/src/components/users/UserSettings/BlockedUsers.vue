<template>
  <div class="wrapper-blocked">
    <div v-if="!blocked.length" class="empty">No blocked user</div>
    <div v-if="blocked.length">
      <ul id="list-users">
        <li v-for="one in blocked" :key="one">
          <BlockedUserItem :blocked="one" @renew="doFetchBlocked" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineComponent, defineExpose, onBeforeMount } from "vue";
import BlockedUserItem from "./BlockedUserItem.vue";
import { useUserStore } from "@/stores/user";
import { getUrlOf } from "@/router";
import { StoreGeneric } from "pinia";

const user: StoreGeneric = useUserStore();
const blocked = ref([]);

function doFetchBlocked() {
  fetch(getUrlOf("api/users/block/") + user.id, {
    credentials: "include",
  })
    .then((response: Response) => {
      return response.json();
    })
    .then((list) => {
      blocked.value = list;
    })
}

onBeforeMount(() => {
  doFetchBlocked();
});

defineExpose(
  defineComponent({
    name: "BlockedUsers",
  })
);
</script>

<style scoped>
.wrapper-blocked {
  position: absolute;
  width: 70%;
}

.empty {
  margin: 36px 15% 36px 5%;
  padding-right: 2%;
  font-family: "Outfit";
  font-size: 20px;
  color: white;
  text-align: center;
}

#list-users {
  margin: 36px 15% 48px 5%;
  padding-right: 2%;
  list-style: none;
}

li {
  display: flex;
  border-top: 1px solid rgba(59, 57, 57, 0.5);
  width: 100%;
  padding-top: 1em;
  padding-bottom: 1em;
  margin: 0;
}
</style>
