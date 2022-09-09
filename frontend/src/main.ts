import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import VueAxios from "vue-axios";
import { VueCookieNext } from "vue-cookie-next";
import "@/assets/styles/main.css";
import { createPinia } from "pinia";

const store = createPinia();
const app = createApp(App);

app.use(router);
app.use(VueAxios, axios);
app.use(VueCookieNext);
app.use(store);
app.mount("#app");
