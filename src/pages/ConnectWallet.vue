<template>
  <ConnectWallet 
    @walletConnected="onWalletConnected" />
</template>

<script>
import ConnectWallet from "../components/ConnectWallet";
import router from "../routes";
import { eFundNetworkSettings } from "../constants";
import { mapMutations } from "vuex";

export default {
  name: "ConnectWalletPage",
  components: {
    ConnectWallet,
  },

  async mounted() {},
  methods: {
    onWalletConnected(signerAddress, chainId) {
      console.log(JSON.stringify(eFundNetworkSettings));

      if (eFundNetworkSettings[chainId.toString()] != undefined) {
        console.log("Wallet connected successfully! Signer address: ", signerAddress);

        this.updateSignerAddress(signerAddress);
        this.updateEFundSettings(eFundNetworkSettings[chainId]);
        
        window.location.replace("/");
      } else {
        alert("unsupported network. Please choose the right one");
      }
    },
    ...mapMutations(["updateEFundSettings", "updateSignerAddress"]),
  },
};
</script>