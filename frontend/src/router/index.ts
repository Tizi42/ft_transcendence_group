import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import GameView from "../views/GameView.vue";
import LoginView from "../views/LoginView.vue";
import UserView from "../views/UserView.vue";
import UserStats from "../components/users/UserStats/UserStats.vue";
import TwoFactorView from "../views/TwoFactorView.vue";
import LeaderboardView from "../views/LeaderboardView.vue";
import WatchView from "../views/WatchView.vue";
import HistoryView from "../views/HistoryView.vue";
import PlayView from "../views/PlayView.vue";
import DevLogin from "../components/DevLogin.vue";
import PlayGame from "../components/game/PlayGame.vue";
import GamePlay from "../components/game/GamePlay.vue";
import UserFriends from "../components/users/friends/UserFriends.vue";
import UserSettings from "../components/users/settings/UserSettings.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "game",
    component: GameView,
  },
  {
    path: "/watch",
    name: "watch",
    component: WatchView,
  },
  {
    path: "/chat",
    name: "chat",
    component: () => import("../views/ChatView.vue"),
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
        component: UserFriends,
      },
      {
        path: "settings",
        name: "settings",
        component: UserSettings,
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
  {
    path: "/pong",
    name: "pong",
    component: PlayGame,
    props: true,
  },
  {
    path: "/test",
    name: "test",
    component: GamePlay,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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

function isKnownRoute(to: string): boolean {
  for (let i = 0; i < router.getRoutes().length; i++) {
    if (to == router.getRoutes()[i].path) return true;
  }
  return false;
}

router.beforeEach(async (to: any, from: any, next: any) => {
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
  } else if (isKnownRoute(to.path)) {
    next();
  } else {
    next({ name: "/" });
  }
});

export default router;
