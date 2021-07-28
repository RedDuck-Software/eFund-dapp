<template>
  <header class="bg-secondary ml-2">
    <b-navbar toggleable="md" class="navbar-secondary navbar-shrink d-flex flex-column px-0 pt-6 position-relative">
      <b-navbar-toggle target="nav-collapse" class="navbar-toggler text-black"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <div class="d-flex menu-wrap d-flex flex-column">
          <b-navbar-nav class="navbar-nav ms-auto flex-column bg-darken rounded w-100">
            <li class="nav-item">
              <HeaderItem :menu="menu.home" :to="{ name: 'Home' }" :text="'Home'" />
            </li>
            <li class="nav-item">
              <HeaderItem :menu="menu.profile" :to="{ name: 'Profile' }" :text="'Profile'" />
            </li>
            <li class="nav-item">
              <HeaderItem :menu="menu.newFund" :to="{ name: 'New Fund' }" :text="'New Fund'" />
            </li>
          </b-navbar-nav>
          <ul class="navbar-nav ms-auto flex-column bg-darken mt-1 rounded w-100">
            <li class="nav-item">
              <HeaderItem :menu="menu.newFund" :to="{ name: 'All Funds' }" :text="'All'" />
            </li>
            <li v-for="(fund, index) in myFundsAsManager" :key="index" class="nav-item">
              <HeaderItem
                :menu="menu.fund"
                :text="`[m] fund${index}`"
                :to="{
                  name: 'Fund',
                  params: {
                    address: fund.address,
                  },
                }"
              />
            </li>
            <li v-for="(fund, j) in fundAsInvestor" :key="j" class="nav-item">
              <HeaderItem
                :menu="menu.fund"
                :text="`[i] fund${j}`"
                :to="{
                  name: 'Fund',
                  params: {
                    address: fund.address,
                  },
                }"
              />
            </li>
          </ul>
        </div>
      </b-collapse>
    </b-navbar>
  </header>
</template>
<script>
// v-on:click="navigateToFund(fund.address, index)"
import { mapGetters, mapMutations } from "vuex";
import HeaderItem from "@/components/HeaderItem";
import { isMetaMaskInstalled, currentProvider } from "../services/ether";
import { FundService } from "../services/fundService";
import router from "../routes";

export default {
  name: "Header",
  components: { HeaderItem },
  data() {
    return {
      scrollPosition: 0,
      hover: false,
      menu: {
        home: {
          icon: "menu_home.svg",
          activeIcon: "menu_active_home.svg",
        },
        profile: {
          icon: "menu_profile.svg",
          activeIcon: "menu_active_profile.svg",
        },
        newFund: {
          icon: "menu_new.svg",
          activeIcon: "menu_active_new.svg",
        },
        allFunds: {
          icon: "menu_all.svg",
          activeIcon: "menu_active_all.svg",
        },
        fund: {
          icon: "menu_fund.svg",
          activeIcon: "menu_active_fund.svg",
        },
      },
    };
  },

  computed: {
    fundAsInvestor() {
      return this.myFundsAsInvestor.filter((a) => !this.myFundsAsManager.some((b) => a.address == b.address));
    },
    ...mapGetters(["signerAddress", "eFundNetworkSettings", "myFundsAsManager", "myFundsAsInvestor"]),
  },
  async mounted() {
    if (this.eFundNetworkSettings == null) return;

    console.log("Funds as manager: ", this.myFundsAsManager);
    console.log("Funds as investor: ", this.myFundsAsInvestor);
  },

  methods: {
    navigateToFund(address, index) {
      router.push({ name: "Fund", params: { address: address } });
    },
    ...mapMutations([
      "logout",
      "clearFundInfo",
      "updateSignerAddress",
      "updateEFundSettings",
      "updateMyFundsAsManager",
    ]),
  },
};
</script>

<style scoped lang="scss">
header {
  min-height: 100vh;
}

.menu-wrap {
  min-width: 76px;
}

.navbar {
  height: 100%;
}

.navbar-collapse {
  align-items: flex-start;
  z-index: 12;
}

.navbar-toggler {
  position: absolute;
  top: 12px;
  left: 0;
}
</style>
