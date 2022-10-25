import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "game",
    component: () => import("../views/GameView.vue"),
  },
  {
    path: "/watch",
    name: "watch",
    component: () => import("../views/WatchView.vue"),
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
    component: () => import("../views/UserView.vue"),
    children: [
      {
        path: "stats",
        name: "stats",
        component: () => import("../components/users/UserStats/UserStats.vue"),
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
    component: () => import("../views/LoginView.vue"),
  },
  {
    path: "/dev-login",
    name: "dev-login",
    component: () => import("../components/DevLogin.vue"),
  },
  {
    path: "/2FA",
    name: "2FA",
    component: () => import("../views/TwoFactorView.vue"),
  },
  {
    path: "/leaderboard",
    name: "leaderboard",
    component: () => import("../views/LeaderboardView.vue"),
  },
  {
    path: "/history",
    name: "history",
    component: () => import("../views/HistoryView.vue"),
  },
  {
    path: "/play",
    name: "play",
    component: () => import("../views/PlayView.vue"),
  },
  {
    path: "/pong",
    name: "pong",
    component: () => import("../components/Game/PlayGame.vue"),
    props: true,
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
        next({ name: "user" });
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
    next({ name: "game" }); // ! change to a custom 404 page !
  }
});

export default router;
