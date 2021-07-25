<template>
  <header class="bg-secondary ml-2">
    <nav class="navbar navbar-expand-lg navbar-secondary navbar-shrink d-flex flex-column px-0 pt-6">
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div id="navbarSupportedContent" class="collapse navbar-collapse d-flex min-w-0 d-flex flex-column">
        <ul class="navbar-nav ms-auto flex-column bg-darken rounded w-100">
          <li class="nav-item">
            <HeaderItem :menu="menu.home" :to="{ name: 'Home' }" :text="'Home'" />
          </li>
          <li class="nav-item">
            <HeaderItem :menu="menu.profile" :to="{ name: 'Profile' }" :text="'Profile'" />
          </li>
          <li class="nav-item">
            <HeaderItem :menu="menu.newFund" :to="{ name: 'New Fund' }" :text="'New Fund'" />
          </li>
        </ul>
        <ul class="navbar-nav ms-auto flex-column bg-darken mt-1 rounded w-100">
          <li class="nav-item">
            <HeaderItem :menu="menu.newFund" :to="{ name: 'All Funds' }" :text="'All'" />
          </li>
          <li v-for="(fund, index) in myFundsAsManager" :key="index" class="nav-item">
            <HeaderItem
              :to="{
                name: 'Fund',
                params: {
                  address: fund.address,
                },
              }"
              :menu="menu.fund"
              :text="`fund ${index}`"

            />
          </li>
        </ul>
      </div>
    </nav>
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
    ...mapGetters(["signerAddress", "eFundNetworkSettings", "userIsManager", "myFundsAsManager"]),
  },
  async mounted() {
    if (this.eFundNetworkSettings == null) return;

    console.log("My funds as manager: ", this.myFundsAsManager);

    this.fundService = new FundService(this.eFundNetworkSettings.eFundPlatformAddress, currentProvider());

    if (this.userIsManager) {
      const curUserFundsAsManager = await this.fundService.getAllManagerFunds(this.signerAddress);
      this.updateMyFundsAsManager(curUserFundsAsManager);

      console.log("User funds", curUserFundsAsManager);
    }
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
      "updateUserIsManager",
    ]),
  },
};
</script>

<style scoped lang="scss">
header {
  min-height: 100vh;
}

.navbar {
  height: 100%;
}
</style>
