<template>
  <div class="container-fluid">
    <ConnectWallet v-if="!signerAddress" />
    <div v-else class="text-gray truncate ml-2">
      {{ signerAddress }}
    </div>
    <div class="top-funds">
      <h1>TOP-3 funds now</h1>
      <h3>Try to invest</h3>
      <div class="row">
        <div v-for="(fund, index) in topFunds" :key="index">
          <Card :fundInfo="fund" />
        <div class="col-sm-4">
          <FundCard title="Test Fund" author="Ben Johnson" />
        </div>
        <div class="col-sm-4">
          <FundCard title="Test Fund1" author="Ben Johnson3" />
        </div>
      </div>
      <div class="row">
        <div class="col-sm-4">
          <FundCard title="Test Fund12" author="Ben Johnson34" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import ConnectWallet from "../components/ConnectWallet";
import Card from "@/components/Card";
import { currentProvider } from "../services/ether";
import router from "../routes";
import { FundService } from "../services/fundService";
import { getBnbPriceInUSTD, getEthPriceInUSTD, getPercentageDiff } from "../services/helpers";
import FundCard from "@/components/FundCard";

export default {
  name: "Home",
  components: { Card, ConnectWallet },
  data() {
    return {
      topFunds: [],
    };
  },
  components: { FundCard, ConnectWallet },
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

<style scoped></style>
