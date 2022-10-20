import { ref, Ref } from "vue";
import { defineStore } from "pinia";
import { User } from "@backend/users/users.entity";

type voidFunction = () => void;

export interface userInfoStore {
  id: Ref<number>;
  displayName: Ref<string>;
  status: Ref<string>;
  email: Ref<string>;
  avatarUrl: Ref<string>;
  enabled2FA: Ref<boolean>;
  friends: Ref<Array<User>>;
  pending: Ref<Array<User>>;
  totalGames: Ref<number>;
  totalVictories: Ref<number>;
  winRate: Ref<number>;
  doFetch: voidFunction;
  doFetchFriends: voidFunction;
  doFetchPending: voidFunction;
}

export const useUserStore = defineStore("user", (): userInfoStore => {
  const id = ref(0);
  const displayName = ref("");
  const status = ref("");
  const email = ref("");
  const enabled2FA = ref(false);
  const avatarUrl = ref("");
  const friends = ref([]);
  const pending = ref([]);
  const totalGames = ref(0);
  const totalVictories = ref(0);
  const winRate = ref(-1);

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
        status.value = user.status;
        email.value = user.email;
        avatarUrl.value = user.picture;
        enabled2FA.value = user.isTwoFactorAuthenticationEnabled;
        totalGames.value = user.totalGames;
        totalVictories.value = user.totalVictories;
        winRate.value = user.winRate;
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
        pending.value = list;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return {
    id,
    displayName,
    status,
    email,
    avatarUrl,
    enabled2FA,
    friends,
    pending,
    totalGames,
    totalVictories,
    winRate,
    doFetch,
    doFetchFriends,
    doFetchPending,
  };
});
