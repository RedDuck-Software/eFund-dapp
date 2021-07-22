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
        <div class="col-sm-4">
          <Card title="Test Fund" author="Ben Johnson" />
        </div>
        <div class="col-sm-4">
          <Card title="Test Fund1" author="Ben Johnson3" />
        </div>
      </div>
      <div class="row">
        <div class="col-sm-4">
          <Card title="Test Fund12" author="Ben Johnson34" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import ConnectWallet from "../components/ConnectWallet";
import Card from "@/components/Card";
import { isMetaMaskInstalled, walletProvider } from "../services/ether";
import { networkSettings }  from "../constants";
import  router from "../routes";

export default {
  name: "Home",
  components: { Card, ConnectWallet },
  computed: {
    ...mapGetters(["signerAddress", "eFundNetworkSettings"]),
  },
  async mounted() {
    
  },
  methods:  {
    logoutAndRedirectToConnectWalletPage() { 
      this.logout();
      router.replace('connectWallet');
    },
    ...mapMutations(["logout", "clearFundInfo", "updateSignerAddress", "updateEFundSettings"]),
  },
};
</script>

<style scoped></style>
