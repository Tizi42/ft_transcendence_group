import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import VueAxios from "vue-axios";
// import io from "/usr/local/lib/node_modules/socket.io-client";

const app = createApp(App);

app.use(router);
app.use(VueAxios, axios);
app.mount("#app");
// app.config.globalProperties.$io = io;
