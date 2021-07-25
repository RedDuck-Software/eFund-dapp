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
      <div class="row flex-wrap ">
        <div :key="0" class="col-12 col-sm-6 col-lg-4 mt-2 mt-md-0">
          <FundCard v-if="topFunds[0]" :fund-info="topFunds[0]" />
        </div>
        <div :key="1" class="col-12 col-sm-6 col-lg-4 mt-2 mt-md-0">
          <FundCard v-if="topFunds[1]" :fund-info="topFunds[1]" />
        </div>
      </div>
      <div class="row flex-wrap ">
        <div :key="2" class="col-12 col-sm-6 col-lg-4 mt-2 mt-md-0">
          <FundCard v-if="topFunds[2]" :fund-info="topFunds[2]" />
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
    this.fundService = new FundService(this.eFundNetworkSettings.eFundPlatformAddress, currentProvider());
    this.topFunds = await this.fundService.getTopFunds(5);

    // console.log(getBnbPriceInUSTD(1626953340));
    // console.log(getEthPriceInUSTD(1626953340));

    // console.log(getPercentageDiff(1488, 1234), "%");
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
</style>
