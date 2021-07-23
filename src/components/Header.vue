<template>
  <header class="bg-secondary">
    <nav class="navbar navbar-expand-lg navbar-secondary navbar-shrink d-flex flex-column">
      <a class="navbar-brand" href="/"> Awesome EFund </a>
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

          <li v-for="(fund, index) in myFundsAsManager" :key="index" :v-bind="myFundsAsManager" class="nav-item">
            <HeaderItem
              :menu="menu.fund"
              :text="'fund 1'"
              :to="{
                name: 'Fund',
                params: {
                  address: fund.address,
                },
              }"
            />
          </li>
          <li v-for="fundIsManager in fundsIsManager" :key="fundIsManager.id" class="nav-item rounded">
            <HeaderItem
              :menu="menu.fund"
              :to="{ name: 'Fund', params: { address: fundIsManager.id } }"
              :text="fundIsManager.text"
            />
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import HeaderItem from "@/components/HeaderItem";
import { isMetaMaskInstalled, currentProvider } from "../services/ether";
import { FundService } from "../services/fundService";

export default {
  name: "Header",
  data() {
    return {
      scrollPosition: 0,
      fundsIsManager: [],
    };
  },
  computed: {
    ...mapGetters(["signerAddress", "eFundNetworkSettings", "userIsManager", "myFundsAsManager"]),
  },
  async mounted() {
    this.fundService = new FundService(this.eFundNetworkSettings.eFundPlatformAddress, currentProvider());
    const platformContract = this.fundService.getFundPlatformContractInstance();

    const isUserManager = (await platformContract.managerFundActivity(this.signerAddress)).isValue;

    console.log("Is user manager: ", isUserManager);

    if (isUserManager) {
      const curUserFundsAsManager = Array.from(await this.fundService.getAllManagerFunds(this.signerAddress));
      this.updateMyFundsAsManager(curUserFundsAsManager);

      console.log("User funds", curUserFundsAsManager);

      console.log("User funds", this.myFundsAsManager);

    }

    // todo : fetch user`s funds as a investor
    // todo : Investigate, what would be better - fetching backend or modify a smart contract

    this.updateUserIsManager(isUserManager);
    this.$forceUpdate();
  },

  methods: {
    ...mapMutations(["updateUserIsManager", "updateMyFundsAsManager"]),
  },
};
</script>

<style scoped>
header {
  min-height: 100vh;
}

.navbar {
  height: 100%;
}
</style>
