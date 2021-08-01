<template>
  <div class="container-fluid">
    <h1 class="mb-3 font-weight-bold">Home</h1>
    <div v-if="!signerAddress" class="connect-container box-shadow bg-lightest rounded p-4">
      <ConnectWallet />
    </div>

    <div v-else class="text-gray truncate ml-2">
      {{ signerAddress }}
    </div>
    <div class="top-funds mt-4">
      <h1 class="font-weight-bold">TOP-3 funds now</h1>
      <h2 class="mb-3">Try to invest</h2>
      <div class="row flex-wrap">
        <div v-for="(fund, index) in topFunds" :key="index" class="card-wrapper">
          <FundCard :fund-info="fund" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import ConnectWallet from "../components/ConnectWallet";
import { currentProvider } from "../services/ether";
import router from "../routes";
import { FundService } from "../services/fundService";
import { getBnbPriceInUSTD, getEthPriceInUSTD, getPercentageDiff } from "../services/helpers";
import FundCard from "@/components/FundCard";

export default {
  name: "Home",
  components: { FundCard, ConnectWallet },
  data() {
    return {
      topFunds: [],
    };
  },
  computed: {
    ...mapGetters(["signerAddress", "eFundNetworkSettings"]),
  },
  async mounted() {
    this.fundService = new FundService(this.eFundNetworkSettings, currentProvider());
    this.topFunds = await this.fundService.getTopFunds(5);
  },
  methods: {
    logoutAndRedirectToConnectWalletPage() {
      this.logout();
      router.replace("connectWallet");
    },
    ...mapMutations(["logout", "clearFundInfo", "updateSignerAddress", "updateEFundSettings"]),
  },
};
</script>

<style scoped>
.connect-container {
  width: 334px;
}

.card-wrapper { 
  margin: 8px;
}
</style>
