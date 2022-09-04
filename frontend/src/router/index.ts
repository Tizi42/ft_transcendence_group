import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import GameView from "../views/GameView.vue";
import LoginView from "../views/LoginView.vue";
import UserView from "../views/UserView.vue";
import UserStats from "../components/users/UserStats.vue";

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
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
