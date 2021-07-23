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
    ...mapGetters(["eFundNetworkSettings", "signerAddress"]),
  },
  async mounted() {
    // this.fundService = new FundService(this.eFundNetworkSettings.eFundPlatformAddress, currentProvider());
    // const platformContract = this.fundService.getFundPlatformContractInstance();

    const isUserManager = false; //(await platformContract.managerFundActivity(this.signerAddress)).isValue;

    this.updateUserIsManager(isUserManager);

    this.isLoaded = true;
  },
  methods: {
    ...mapMutations(["updateUserIsManager"]),
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
  width: 8%;
}

.main {
}
</style>
