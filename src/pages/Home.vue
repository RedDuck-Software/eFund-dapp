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
import { mapGetters } from "vuex";
import ConnectWallet from "../components/ConnectWallet";
import Card from "@/components/Card";

export default {
  name: "Home",
  components: { Card, ConnectWallet },
  computed: {
    ...mapGetters(["signerAddress", "eFundNetworkSettings"]),
  },
  async mounted() {
    if ((this.eFundNetworkSettings == null || this.eFundNetworkSettings == undefined) ||
      !isMetaMaskInstalled() ||
      (networkSettings[(await walletProvider.currentProvider.getNetwork()).chainId] === undefined) || 
      ((await walletProvider.currentProvider.getNetwork()).chainId != this.eFundNetworkSettings.chainId)
    ) {
      this.logoutAndRedirectToConnectWalletPage()
      return;
    }
    
    walletProvider.currentProvider.provider.on("accountsChanged", ([newAddres]) => {
      console.log("new address is :", newAddres);
      this.clearFundInfo();
      this.updateSignerAddress(newAddres);
      window.location.reload();
    });

    walletProvider.currentProvider.provider.on("chainChanged", (newChainId) => {
      alert("new chainId is :", newChainId.toString());
      
      this.clearFundInfo();

      if(!networkSettings[newChainId]) { 
        this.logoutAndRedirectToConnectWalletPage();
        return;
      }

      this.updateEFundSettings(networkSettings[newChainId]);

      router.replace("/");
    });

    
    this.isLoaded = true;
    this.$forceUpdate(); 
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
