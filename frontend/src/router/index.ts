import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import GameView from "../views/GameView.vue";
import LoginView from "../views/LoginView.vue";
import LeaderboardView from "../views/LeaderboardView.vue";
import HistoryView from "../views/HistoryView.vue";
import PlayView from "../views/PlayView.vue";
//import UserView from "../views/UserView.vue";

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
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/UserView.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
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

export default router;
