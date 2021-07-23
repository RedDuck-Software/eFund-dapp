import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

import Home from "./pages/Home.vue";
import Fund from "./pages/Fund.vue";
import NewFund from "./pages/NewFund.vue";
import All from "./pages/All.vue";
import Profile from "./pages/Profile.vue";
import ConnectWalletPage from "./pages/ConnectWallet.vue";

import store from "./store/index";
import { eFundNetworkSettings as networkSettings } from "./constants";
import { walletProvider, isMetaMaskInstalled } from "./services/ether";

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  { path: "", component: Home, name: "Home" },
  { path: "/new-fund", component: NewFund, name: "New Fund" },
  { path: "/all-funds", component: All, name: "All Funds" },
  { path: "/profile", component: Profile, name: "Profile" },
  { path: "/fund/:address", component: Fund, name: "Fund" },
  { path: "/connectWallet", component: ConnectWalletPage, name: "ConnectWalletPage" },
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

//store.getters.

// let beforeEachExecuted = false;

router.beforeEach(async (to, from, next) => {
  console.log(from);

  if (from.name == null) {
    reSubscribeWalletEvents();
  }

  if (to.name == from.name) {
    console.log("identical pathes");
    return;
  }

  if (to.name == "ConnectWalletPage") {
    next();
    return;
  }

  if (
    (to.fullPath != from.fullPath,
    store.state.eFundNetworkSettings == null ||
      store.state.eFundNetworkSettings == undefined ||
      !isMetaMaskInstalled() ||
      networkSettings[(await walletProvider.currentProvider.getNetwork()).chainId] === undefined ||
      (await walletProvider.currentProvider.getNetwork()).chainId != store.state.eFundNetworkSettings.chainId)
  ) {
    store.commit("logout");
    next({ name: "ConnectWalletPage" });
  } else next();
});

export const reSubscribeWalletEvents = () => {
  // @ts-ignore: cannot assign vm to Event for some reasone
  walletProvider.currentProvider.provider.on("accountsChanged", ([newAddres]) => {
    console.log("new address is :", newAddres);
    store.commit("clearFundInfo");
    store.commit("updateSignerAddress", newAddres);
    window.location.reload();
  });

  // @ts-ignore: cannot assign vm to Event for some reasone
  walletProvider.currentProvider.provider.on("chainChanged", newChainId => {
    console.log("new chainId is :", newChainId);

    store.commit("clearFundInfo");

    if (!networkSettings[newChainId]) {
      store.commit("logout");
      router.replace({ name: "ConnectWalletPage" });
      return;
    }

    store.commit("updateEFundSettings", networkSettings[newChainId]);

    router.replace("/");
  });
};
