<template>
  <div class=" p-4 text-center">
    <div v-if="networkError" class="alert alert-warning alert-dismissible fade show" role="alert">
      {{ networkError }}
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div>
      <p>Please connect to your wallet.</p>
      <button type="button" :disabled="checkMetaMask()" @click="handleConnectWallet()">
        Connect Wallet
      </button>
    </div>
  </div>
</template>

<script>
import { getSigner, isMetaMaskInstalled, currentProvider } from "../services/ether";
import { mapMutations } from "vuex";

export default {
  name: "ConnectWallet",
  data() {
    return {
      networkError: "",
    };
  },
  methods: {
    checkMetaMask() {
      return !isMetaMaskInstalled();
    },
    async handleConnectWallet() {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts[0]) {
        const { address } = await getSigner();
        this.updateSignerAddress(address);
      }

      currentProvider.on("accountsChanged", ([newAddress]) => {
        console.log("accountsChanged");
        if (newAddress === undefined) {
          this.networkError = "";
        }
        this.updateSignerAddress(newAddress);
      });

      currentProvider.on("chainIdChanged", async ([networkId]) => {
        this.networkError = "";
        const { address } = await getSigner();
        this.updateSignerAddress(address);
      });
    },
    ...mapMutations(["updateSignerAddress"]),
  },
};
</script>

<style scoped></style>
