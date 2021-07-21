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
      <button type="button" :disabled="!checkMetaMask()" class="btn btn-primary" @click="handleConnectWallet()">
        Connect Wallet
      </button>
    </div>
      <span v-if="!checkMetaMask()">Metamask is not installed</span>
  </div>
</template>

<script>
import { createWeb3Provider ,isMetaMaskInstalled, walletProvider} from "../services/ether";
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

        const address  = await walletProvider.currentProvider.getSigner().getAddress();
        console.log(address);

        const { chainId } = await walletProvider.currentProvider.getNetwork();

        console.log(chainId);

        this.$emit('walletConnected',address, chainId );
      }
    },
  },
};
</script>

<style scoped></style>
 