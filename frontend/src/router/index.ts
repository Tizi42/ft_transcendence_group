import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import GameView from "../views/GameView.vue";
import LoginView from "../views/LoginView.vue";
import UserView from "../views/UserView.vue";
import UserStats from "../components/users/UserStats.vue";
import TwoFactorView from "../views/TwoFactorView.vue";
import LeaderboardView from "../views/LeaderboardView.vue";
import HistoryView from "../views/HistoryView.vue";
import PlayView from "../views/PlayView.vue";
import DevLogin from "../components/DevLogin.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "game",
    component: GameView,
  },
  {
    path: "/chat",
    name: "chat",
    component: () =>
      import("../views/ChatView.vue"),
  },
  {
    path: "/user",
    name: "user",
    redirect: "/user/stats",
    component: UserView,
    children: [
      {
        path: "stats",
        name: "stats",
        component: UserStats,
      },
      {
        path: "friends",
        name: "friends",
        component: () =>
          import("../components/users/UserFriends/UserFriends.vue"),
      },
      {
        path: "settings",
        name: "settings",
        component: () =>
          import("../components/users/UserSettings/UserSettings.vue"),
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/dev-login",
    name: "dev-login",
    component: DevLogin,
  },
  {
    path: "/2FA",
    name: "2FA",
    component: TwoFactorView,
  },
  {
    path: "/leaderboard",
    name: "leaderboard",
    component: LeaderboardView,
  },
  {
    path: "/history",
    name: "history",
    component: HistoryView,
  },
  {
    path: "/play",
    name: "play",
    component: PlayView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

async function getStatus() {
  return fetch(getUrlOf("api/private"), {
    credentials: "include",
  })
    .then((response) => {
      return response.status;
    })
    .then((status) => {
      if (status === 200) {
        return true;
      }
      return false;
    })
    .catch((error) => {
      console.log("ERROR : ", error);
      return false;
    });
}

async function getPreAuth() {
  return fetch(getUrlOf("api/preAuth"), {
    credentials: "include",
  })
    .then((response) => {
      return response.status;
    })
    .then((status) => {
      if (status === 200) {
        return true;
      }
      return false;
    })
    .catch((error) => {
      console.log("ERROR : ", error);
      return false;
    });
}

export function getUrlOf(str: string, port = 3000): string {
  return (
    "http://" + window.location.hostname + ":" + port.toString() + "/" + str
  );
}

router.beforeEach(async (to, from, next) => {
  const isAuthenticated = await getStatus();
  const isPreAuth = await getPreAuth();

  if (to.name === "2FA") {
    if (!isPreAuth && !isAuthenticated) {
      next({ name: "login" });
    } else if (isPreAuth && !isAuthenticated) {
      next();
    } else if (isAuthenticated) {
      if (from.fullPath === "/user/settings") {
        next();
      } else {
        next({ name: "settings" });
      }
    }
  } else if (
    !(to.name === "login" || to.name === "dev-login") &&
    !isAuthenticated
  ) {
    next({ name: "login" });
  } else next();
});

export default router;
