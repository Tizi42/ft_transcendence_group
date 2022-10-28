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
  pendingMsgList: Ref<Array<number>>;
  pendingMsgChannel: Ref<Array<number>>;
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
  const pendingMsgList: Ref<Array<number>> = ref([]);
  const pendingMsgChannel: Ref<Array<number>> = ref([]);

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
      });
  }

  socket.on("friend_login_logout", async () => {
    doFetchFriends();
  });

  socket.on("receive_friendship", () => {
    doFetchPending();
    doFetchFriends();
  });

  socket.on("friend_update", () => {
    doFetchFriends();
    doFetchPending();
  });

  socket.on("receive_message_notification", (authorId: number) => {
    pendingMsgList.value.push(authorId);
  });

  socket.on("ignore_private_notif", (receiverId: number) => {
    const index = pendingMsgList.value.indexOf(receiverId);
    if (index != -1) {
      pendingMsgList.value.splice(index, 1);
    }
  });

  socket.on(
    "receive_channel_notification",
    (authorId: number, channelId: number) => {
      if (authorId != id.value) {
        pendingMsgChannel.value.push(channelId);
      }
    }
  );

  socket.on("ignore_channel_notif", (selectedChannelId: number) => {
    const index = pendingMsgChannel.value.indexOf(selectedChannelId);
    if (index != -1) {
      pendingMsgChannel.value.splice(index, 1);
    }
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
    pendingMsgList,
    pendingMsgChannel,
    doFetch,
    doFetchFriends,
    doFetchPending,
  };
});
