import { ref, Ref } from "vue";
import { defineStore } from "pinia";
import { User } from "@backend/users/users.entity";
import socket from "@/socket";
import { getUrlOf } from "@/router";

type voidFunction = () => void;

export interface userInfoStore {
  id: Ref<number>;
  displayName: Ref<string>;
  status: Ref<string>;
  email: Ref<string>;
  avatarUrl: Ref<string>;
  enabled2FA: Ref<boolean>;
  allowNotifications: Ref<boolean>;
  friends: Ref<Array<User>>;
  pending: Ref<Array<User>>;
  totalGames: Ref<number>;
  totalVictories: Ref<number>;
  totalDraws: Ref<number>;
  winRate: Ref<number>;
  channelInvitePending: Ref<Array<number>>;
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
  const totalDraws = ref(0);
  const winRate = ref(-1);
  const allowNotifications = ref(true);
  const channelInvitePending: Ref<Array<number>> = ref([]);

  doFetch();
  doFetchFriends();
  doFetchPending();

  function doFetch() {
    fetch(getUrlOf("api/private"), {
      credentials: "include",
    })
      .then((response: Response) => {
        return response.json();
      })
      .then((user: User) => {
        id.value = user.id;
        displayName.value = user.displayName;
        status.value = user.status;
        email.value = user.email;
        avatarUrl.value = user.picture;
        enabled2FA.value = user.isTwoFactorAuthenticationEnabled;
        totalGames.value = user.totalGames;
        totalVictories.value = user.totalVictories;
        totalDraws.value = user.totalDraws;
        winRate.value = user.winRate;
        allowNotifications.value = user.allowNotifications;
        channelInvitePending.value = user.memberPendingReqFrom;
      })
      .catch((error: Error) => {
        console.log(error);
      });
  }

  function doFetchFriends() {
    fetch(getUrlOf("api/users/friends/") + id.value, {
      credentials: "include",
    })
      .then((response: Response) => {
        return response.json();
      })
      .then((list) => {
        friends.value = list;
      })
      .catch((error: Error) => {
        console.log(error);
      });
  }

  function doFetchPending() {
    fetch(getUrlOf("api/users/friends/from/") + id.value, {
      credentials: "include",
    })
      .then((response: Response) => {
        return response.json();
      })
      .then((list) => {
        pending.value = list;
      })
      .catch((error: Error) => {
        console.log(error);
      });
  }

  let i = 0;
  socket.on("receive_friendship", () => {
    console.log("received friend", i++);
    doFetchPending();
    doFetchFriends();
  });

  socket.on("friend_update", () => {
    doFetchFriends();
    doFetchPending();
  });

  return {
    id,
    displayName,
    status,
    email,
    avatarUrl,
    enabled2FA,
    allowNotifications,
    friends,
    pending,
    totalGames,
    totalVictories,
    totalDraws,
    winRate,
    channelInvitePending,
    doFetch,
    doFetchFriends,
    doFetchPending,
  };
});
