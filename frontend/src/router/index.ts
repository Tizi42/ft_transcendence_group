import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import GameView from "../views/GameView.vue";
import LoginView from "../views/LoginView.vue";
import UserView from "../views/UserView.vue";
import UserStats from "../components/users/UserStats.vue";
import TwoFactorView from "../views/TwoFactorView.vue";
import LeaderboardView from "../views/LeaderboardView.vue";
import HistoryView from "../views/HistoryView.vue";
import PlayView from "../views/PlayView.vue";

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
      import(/* webpackChunkName: "about" */ "../views/ChatView.vue"),
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
        name: "firends",
        component: () => import("../components/users/UserFriends.vue"),
      },
      {
        path: "settings",
        name: "settings",
        component: () => import("../components/users/UserSettings.vue"),
        // children: [
        //   {
        //     path: "account",
        //     component: Account,
        //   },
        //   {
        //     path: "privacy",
        //     component: Privacy,
        //   },
        //   {
        //     path: "block",
        //     component: BlockList,
        //   },
        // ]
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
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
  return fetch("http://localhost:3000/api/private", {
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
      return error;
    });
}

router.beforeEach(async (to, from, next) => {
  console.log("to.name = ", to.name, " from.fullPath = ", from.fullPath);
  const isAuthenticated = await getStatus();
  if (to.name !== "login" && !isAuthenticated && to.name !== "2FA") {
    next({ name: "login" });
  } else next();
});

export default router;
