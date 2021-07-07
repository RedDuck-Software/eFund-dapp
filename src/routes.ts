import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

import Home from "./pages/Home.vue";
import Fund from "./pages/Fund.vue";

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path: "/",
    component: Home,
    name: "Home",
  },
  { path: "/fund/:address", component: Fund, name: "Fund" },
];

const router: VueRouter = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    if (to.hash) {
      return { selector: to.hash };
    }
    return { x: 0, y: 0 };
  },
});

export default router;
