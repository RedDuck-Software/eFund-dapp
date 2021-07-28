<template>
  <div v-if="isLoaded" id=" " class="app min-vh-100 bg-secondary d-flex px-3">
    <Header class="header" />
    <div class="main container-fluid text-gray py-6">
      <router-view></router-view>
    </div>
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
    ...mapGetters(["eFundNetworkSettings", "signerAddress", "platformSettings"]),
  },
  async mounted() {
    if (this.eFundNetworkSettings == null) {
      this.isLoaded = true;
      return;
    }

    console.log("signer: ", this.signerAddress);

    this.fundService = new FundService(this.eFundNetworkSettings.eFundPlatformAddress, currentProvider());

    if (this.platformSettings == null) {
      const platformSettings = await this.fundService.getPlatformSettings();
      this.updatePlatformSettings(platformSettings);
    }

    const curUserFundsAsManager = await this.fundService.getAllManagerFunds(this.signerAddress);
    this.updateMyFundsAsManager(curUserFundsAsManager);

    const curUserFundsAsInvestor = await this.fundService.getAllInvestorsFunds(this.signerAddress);
    this.updateMyFundsAsInvestor(curUserFundsAsInvestor);

    console.log("users funds as investor: ",  curUserFundsAsInvestor);

    this.isLoaded = true;
  },
  methods: {
    ...mapMutations(["updateMyFundsAsManager", "updatePlatformSettings", "updateMyFundsAsInvestor"]),
  },
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&display=swap");

html,
body {
  font-family: "Montserrat", sans-serif;
}

.app {
  font-family: "Montserrat", sans-serif;
}

.header {
  width: 0%;
}

@media screen and (min-width: 768px) {
  .header {
    width: 8%;
  }
}

.main {
}
</style>
