import { ref, Ref } from "vue";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import GameView from "../views/GameView.vue";
import LoginView from "../views/LoginView.vue";
import TwoFactorAuthenticationView from "../views/TwoFactorAuthenticationView.vue";

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
    path: "/2FA",
    name: "2FA",
    component: TwoFactorAuthenticationView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

const result: Ref<boolean> = ref(false);

const isAuthenticated = () => {
  fetch("http://localhost:3000/api/private", {
    credentials: "include",
  })
    .then((response) => {
      if (response.status === 200) {
        result.value = true;
        return result.value;
      }
      return response.json();
    })
    .catch((error) => {
      console.log("ERROR : ", error);
    });
  console.log(result.value);
  return result.value;
};

router.beforeEach((to, from, next) => {
  console.log("to.name = ", to.name);
  // if (to.name === "2FA") {
  //   next();
  //   return;
  // }
  if (to.name !== "login" && !isAuthenticated() && to.name !== "2FA") {
    next({ name: "login" });
  } else next();
});

export default router;
