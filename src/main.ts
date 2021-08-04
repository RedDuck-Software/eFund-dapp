import "bootstrap/dist/css/bootstrap.css";
import "@popperjs/core";

import Vue from "vue";
import App from "./App.vue";
import router from "./routes";
import store from "./store";
import "./icons";

import 'ant-design-vue/dist/antd.css';
import Skeleton from 'ant-design-vue/lib/skeleton';
Vue.component(Skeleton.name, Skeleton);

import VueSocialSharing from "vue-social-sharing";
import PortalVue from "portal-vue";
import VueLoading from "vuejs-loading-plugin";

import VueParticles from "vue-particles";
Vue.use(VueParticles);

import VueFormWizard from "vue-form-wizard";
import "vue-form-wizard/dist/vue-form-wizard.min.css";
Vue.use(VueFormWizard);

import { BootstrapVue, IconsPlugin } from "bootstrap-vue";

// Import Bootstrap an BootstrapVue CSS files (order is important)
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);

Vue.use(VueSocialSharing);
Vue.use(PortalVue);
Vue.use(VueLoading, { dark: true });

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

Vue.component("FontAwesomeIcon", FontAwesomeIcon);

Vue.config.productionTip = false;

Vue.filter("reverse", function(value) {
  // slice to make a copy of array, then reverse the copy
  return value.slice().reverse();
});

export const vm = new Vue({
  el: "#app",
  components: { App },
  render: h => h(App),
  router,
  store,
});

// @ts-ignore: cannot assign vm to Event for some reasone
window.Event = vm;
