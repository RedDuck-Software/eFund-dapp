import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

import Home from "./pages/Home.vue";
import Fund from "./pages/Fund.vue";
import NewFund from "./pages/NewFund.vue";
import Profile from "./pages/Profile.vue";

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  { path: "/", component: Home, name: "Home" },
  { path: "/new-fund", component: NewFund, name: "New Fund" },
  { path: "/profile", component: Profile, name: "Profile" },
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
