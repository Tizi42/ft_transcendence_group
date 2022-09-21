import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import VueAxios from "vue-axios";
import { defineCustomElements as defineIonPhaser } from "@ion-phaser/core/loader";

const app = createApp(App);
app.config.compilerOptions.isCustomElement = (tag) => tag.startsWith("ion-");
defineIonPhaser(window);

app.use(router);
app.use(VueAxios, axios);
app.mount("#app");
