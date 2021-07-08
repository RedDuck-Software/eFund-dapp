<template>
  <div class="w-50 mx-auto">
    <div class="d-flex">
      <label>
        Amount for swap
        <input
          v-model="fromSwapValue"
          type="number"
          min="0"
          name="from swap"
          class="form-control"
          @change="handleFromValueChange()"
        />
      </label>
      <select v-model="fromSwapCurr" class="form-control" @change="handleFromValueChange()">
        <option v-for="(item, index) in tokensList" :key="index" :value="item">
          {{ item.label }}
        </option>
      </select>
    </div>

    <div class="d-flex">
      <label>
        Get after swap
        <input
          v-model="toSwapValue"
          type="number"
          min="0"
          name="to swap"
          class="form-control"
          @change="handleToValueChange()"
        />
      </label>
      <select v-model="toSwapCurr" class="form-control" @change="handleFromValueChange()">
        <option v-for="(item, index) in tokensList" :key="index" :value="item">
          {{ item.label }}
        </option>
      </select>
    </div>
    <div class="d-flex">
      <button @click="swap()">Swap!</button>
    </div>
  </div>
</template>

<script>
import tokens from "../services/tokens.json";
import { BigNumber, FixedNumber, ethers, utils, Contract } from "ethers";
import { currentProvider, getSigner } from "../services/ether";
import { pancakeRouterContractAbi, erc20TokenContractAbi } from "../constants";
import { mapGetters } from "vuex";

export default {
  name: "FundTrade",
  props: ["fundContract"],
  computed: {
    ...mapGetters(["fundContractAddress"]),
  },
  data() {
    return {
      tokensList: [],
      fromSwapValue: 0,
      fromSwapCurr: "",
      toSwapValue: 0,
      toSwapCurr: "",
    };
  },
  mounted() {
    this.tokensList = tokens.data.map(token => {
      return {
        value: token.address,
        label: token.symbol,
      };
    });

    this.fromSwapCurr = this.tokensList[0];
    this.toSwapCurr = this.tokensList[0];
  },
  methods: {
    async handleFromValueChange() {
      if (this.fromSwapCurr.value === this.toSwapCurr.value) {
        this.toSwapValue = this.fromSwapValue;
        return;
      }

      if (this.fromSwapValue > 0) {
        const amounts = await this.getPricesPath(BigNumber.from(FixedNumber.from(this.fromSwapValue)), [
          this.fromSwapCurr.value.toString(),
          this.toSwapCurr.value.toString(),
        ]);

        this.toSwapValue = parseFloat(await utils.formatUnits(amounts[1].toString(), 18)).toFixed(9);
      }
    },
    async handleToValueChange() {
      if (this.fromSwapCurr.value === this.toSwapCurr.value) {
        this.fromSwapValue = this.toSwapValue;
        return;
      }

      const amounts = await this.getPricesPath(BigNumber.from(FixedNumber.from(this.toSwapValue)), [
        this.fromSwapCurr.value,
        this.toSwapCurr.value,
      ]);

      this.fromSwapValue = await utils.formatUnits(amounts[1].toString(), 18);
    },
    async swap() {
      const txhash = await this.sendSwapRequest();
      console.log(txhash);
    },
    async sendSwapRequest() {
      if (this.fromSwapCurr.label === "BNB") {
        return await this.swapETHForTokens();
      } else if (this.toSwapCurr.label === "BNB") {
        return await this.swapERCForETH();
      } else {
        return await this.swapERCForERC();
      }
    },
    async swapERCForERC() { 
        console.log("erc to erc");
        const { jsonSigner } = await getSigner();
        const tokenContract = new Contract(this.fromSwapCurr.value, erc20TokenContractAbi, jsonSigner);

        if (!(await tokenContract.balanceOf(this.fundContractAddress.toString())).isZero()) {
          return await this.fundContract.swapERC20ToERC20(
            this.fromSwapCurr.value,
            this.toSwapCurr.value,
            FixedNumber.from(this.fromSwapValue),
            0
          );
        } else {
          alert(`You need to get this amount of ${this.fromSwapCurr.label}`);
        }
    },
    async swapERCForETH() { 
        console.log("erc to bnb");
        const { jsonSigner } = await getSigner();
        const tokenContract = new Contract(this.fromSwapCurr.value, erc20TokenContractAbi, jsonSigner);

        if (!(await tokenContract.balanceOf(this.fundContractAddress.toString())).isZero()) {
            return await this.fundContract.swapERC20ToETH(
            this.toSwapCurr.value,
            FixedNumber.from(this.fromSwapValue),
            0
          );
        } else {
          alert(`You need thia amount of ${this.fromSwapCurr.label}`);
        }
    },
    async swapETHForTokens() {
      
      console.log("bnb to erc");
        const { jsonSigner } = await getSigner();
        const tokenContract = new Contract(this.fromSwapCurr.value, erc20TokenContractAbi, jsonSigner);


        if (!(await currentProvider.getBalance(this.fundContractAddress)).isZero()) {
          return await this.fundContract.swapETHToERC20(
            this.toSwapCurr.value,
            FixedNumber.from(this.fromSwapValue),
            0
          );

        } else {
          alert("Yuo don't have enough BNB");
        }
    },
    async getPricesPath(amount, path) {
      if (amount.isZero()) {
        return new Array(path.length).fill(BigNumber.from([0]));
      } else {
        const contract = await this.getPancakeRouterContractInstance(await this.getPancakeRouterAddress());
        const res = await contract.getAmountsOut(amount, path);
        return res;
      }
    },
    async getPancakeRouterContractInstance(pancakeContractAddress) {
      const signer = currentProvider.getSigner();
      return new ethers.Contract(pancakeContractAddress, pancakeRouterContractAbi, signer);
    },
    async getPancakeRouterAddress() {
      console.log(await this.fundContract.router());
      return await this.fundContract.router();
    },
  },
};
</script>

<style scoped></style>
