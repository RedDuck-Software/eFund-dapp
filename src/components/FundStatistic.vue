<template>
  <div></div>
</template>

<script>
import { mapGetters } from "vuex";
import { currentProvider, getSigner } from "../services/ether";
import { erc20TokenContractAbi } from "../constants";
import { Contract, utils } from "ethers";
import tokens from "../services/tokens.json";

export default {
  name: "FundStatistic",
  data() {
    return {
      tokensList: [],
    };
  },
  computed: {
    ...mapGetters(["fundContractAddress"]),
  },
  mounted() {
    this.tokensList = tokens.data.map((token) => {
      return {
        value: token.address,
        label: token.symbol,
      };
    });

    this.getBalances();
  },

  methods: {
    async getBalances() {
      const { jsonSigner } = await getSigner();

      console.log(await currentProvider.getBalance(this.fundContractAddress));
      for (const token of this.tokensList) {
        const tokenContract = new Contract(token.value, erc20TokenContractAbi, jsonSigner);
        const bal = parseFloat(
          await utils.formatUnits(await tokenContract.balanceOf(this.fundContractAddress.toString()))
        );

        console.log(token.label, bal);
      }
    },
  },
};
</script>

<style scoped></style>
