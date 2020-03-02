import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import "@mdi/font/css/materialdesignicons.css";
import VueTheMask from "vue-the-mask";

Vue.use(Vuetify, {
  iconfont: "mdi"
});
Vue.use(VueTheMask);

Vue.config.productionTip = false;
Vue.config.debug = process.env.NODE_ENV === "development";

new Vue({
  router,
  store,
  vuetify: new Vuetify(),
  render: h => h(App)
}).$mount("#app");
