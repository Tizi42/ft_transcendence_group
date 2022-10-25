import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import VueAxios from "vue-axios";
import { defineCustomElements as defineIonPhaser } from "@ion-phaser/core/loader";
import { VueCookieNext } from "vue-cookie-next";
import "@/assets/styles/main.css";
import "@/assets/styles/transitions.css";
import "@/assets/styles/historyAndLeaderboard.css";
import "@/assets/styles/gameOverlay.css";
import "@/assets/styles/chat.css";
import "@/assets/styles/authentication.css";
import { createPinia } from "pinia";

const store = createPinia();
const app = createApp(App);

app.config.compilerOptions.isCustomElement = (tag) => {
  return tag.startsWith("ion-");
};
defineIonPhaser(window);

app.use(router);
app.use(VueAxios, axios);
app.use(VueCookieNext);
app.use(store);
app.mount("#app");
