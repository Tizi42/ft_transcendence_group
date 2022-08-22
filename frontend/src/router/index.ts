import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import GameView from "../views/GameView.vue";

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
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
