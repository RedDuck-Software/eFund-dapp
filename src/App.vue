<template>
  <div id="app">
    <div v-if="isLoaded" id=" " class="app min-vh-100 bg-secondary row">
      <Header class="col-lg-1" />
      <div class="main container-fluid text-gray col-lg-11">
        <router-view></router-view>
      </div>
    </div>
    <div v-else>loading...</div>
  </div>
</template>

<script>
import Header from "./components/Header";
import { mapGetters, mapMutations } from "vuex";
import { eFundNetworkSettings as networkSettings } from "./constants";
import "./App.scss";
import router from "./routes";
import { isMetaMaskInstalled, currentProvider } from "./services/ether";
import { FundService } from "./services/fundService";

export default {
  name: "App",
  components: {
    Header,
  },
  data() {
    return {
      isLoaded: false,
    };
  },
  computed: {
    ...mapGetters(["eFundNetworkSettings", "signerAddress"]),
  },
  async mounted() {
    this.fundService = new FundService(this.eFundNetworkSettings.eFundPlatformAddress, currentProvider());
    const platformContract = this.fundService.getFundPlatformContractInstance();

    const isUserManager = (await platformContract.managerFundActivity(this.signerAddress)).isValue;
  
    console.log("Is user manager: ", isUserManager);
    if (isUserManager) {
      const curUserFundsAsManager = await platformContract.getManagerFunds(this.signerAddress);
      this.updateMyFundsAsManager(curUserFundsAsManager);

      console.log("User funds", curUserFundsAsManager);
    }

    // todo : fetch user`s funds as a investor
    // todo : Investigate, what would be better - fetching backend or modify a smart contract

    this.updateUserIsManager(isUserManager);
    this.isLoaded = true;
  },
  methods: {
    ...mapMutations(["updateUserIsManager", "updateMyFundsAsManager"]),
  },
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&display=swap");

html,
body {
  font-family: "Montserrat", sans-serif;
}

#app {
  font-family: "Montserrat", sans-serif;
}

.main {
  padding-top: 120px;
  padding-bottom: 80px;
}
</style>
