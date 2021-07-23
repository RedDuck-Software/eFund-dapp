<template>
  <div class="connect-wrap p-4 d-flex bg-lightest rounded box-shadow">
    <div v-if="networkError" class="alert alert-warning alert-dismissible fade show" role="alert">
      {{ networkError }}
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div>
      <h2 class="mb-2 font-weight-bold">Connection</h2>
      <div class="label">Please connect to your wallet.</div>
      <button type="button" :disabled="!checkMetaMask()" class="btn connect-button mt-4" @click="handleConnectWallet()">
        Connect
      </button>
    </div>
    <span v-if="!checkMetaMask()">Metamask is not installed</span>
  </div>
</template>

<script>
import { createWeb3Provider, isMetaMaskInstalled, walletProvider } from "../services/ether";
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
      return isMetaMaskInstalled();
    },
    async handleConnectWallet() {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts[0]) {
        walletProvider.currentProvider = createWeb3Provider(window.ethereum);

        console.log(walletProvider.currentProvider);

        const address = await walletProvider.currentProvider.getSigner().getAddress();
        console.log(address);

        const { chainId } = await walletProvider.currentProvider.getNetwork();

        console.log(chainId);

        this.$emit("walletConnected", address, chainId);
      }
    },
  },
};
</script>

<style scoped>
.connect-wrap {
  width: 334px;
}
.btn.connect-button {
  background-color: black;
  color: white;
  border-radius: 6px;
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  padding: 8px 39px;
}
</style>
