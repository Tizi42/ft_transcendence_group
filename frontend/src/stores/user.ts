import { ref } from "vue";
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", () => {
  const id = ref(0);
  const displayName = ref("");
  const email = ref("");
  const enabled2FA = ref(false);
  const avatarUrl = ref("");
  const friends = ref([]);
  const pending = ref([]);

  doFetch();
  doFetchFriends();
  doFetchPending();

  function doFetch() {
    fetch("http://localhost:3000/api/private", {
      credentials: "include",
    })
      .then((response) => {
        return response.json();
      })
      .then((user) => {
        id.value = user.id;
        displayName.value = user.displayName;
        email.value = user.email;
        avatarUrl.value = user.picture;
        enabled2FA.value = user.isTwoFactorAuthenticationEnabled;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function doFetchFriends() {
    fetch("http://localhost:3000/api/users/friends/" + id.value, {
      credentials: "include",
    })
      .then((response) => {
        return response.json();
      })
      .then((list) => {
        console.log(list);
        friends.value = list;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function doFetchPending() {
    fetch("http://localhost:3000/api/users/friends/from/" + id.value, {
      credentials: "include",
    })
      .then((response) => {
        return response.json();
      })
      .then((list) => {
        console.log("pending:", list);
        pending.value = list;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return {
    id,
    displayName,
    email,
    avatarUrl,
    enabled2FA,
    friends,
    pending,
    doFetch,
    doFetchFriends,
    doFetchPending,
  };
});
