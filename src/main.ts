import "bootstrap/dist/css/bootstrap.css";
import "@popperjs/core";

import Vue from "vue";
import App from "./App.vue";
import router from "./routes";
import store from "./store";
import "./icons";

import VueSocialSharing from "vue-social-sharing";
import PortalVue from "portal-vue";
import VueLoading from "vuejs-loading-plugin";

import VueParticles from "vue-particles";
Vue.use(VueParticles);

Vue.use(VueSocialSharing);
Vue.use(PortalVue);
Vue.use(VueLoading, { dark: true });

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

Vue.component("FontAwesomeIcon", FontAwesomeIcon);

Vue.config.productionTip = false;

new Vue({
  el: "#app",
  components: { App },
  render: h => h(App),
  router,
  store,
});
