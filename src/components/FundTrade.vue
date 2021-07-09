<template>
  <div class="py-3">
    <div class="trade bg-dark rounded px-5 py-4 my-4">
      <h5 class="text-center text-uppercase mb-3">Trade</h5>
      <div class="row justify-content-center">
        <div class="form col-auto">
          <div class="form-group d-flex justify-content-between">
            <div class="form-input mr-2">
              <input
                v-model="fromSwapValue"
                type="number"
                min="0"
                name="from swap"
                class="form-control"
                @change="handleFromValueChange()"
              />
            </div>
            <div class="form-input">
              <select v-model="fromSwapCurr" class="form-control pl-2 pr-4" @change="handleFromValueChange()">
                <option v-for="(item, index) in tokensList" :key="index" :value="item">
                  {{ item.label }}
                </option>
              </select>
            </div>
          </div>
          <div class="form-group d-flex justify-content-between">
            <div class="form-input mr-2">
              <input
                v-model="toSwapValue"
                type="number"
                min="0"
                name="to swap"
                class="form-control"
                @change="handleToValueChange()"
              />
            </div>
            <div class="form-input">
              <select v-model="fromSwapCurr" class="form-control pl-2 pr-4" @change="handleFromValueChange()">
                <option v-for="(item, index) in tokensList" :key="index" :value="item">
                  {{ item.label }}
                </option>
              </select>
            </div>
          </div>
          <div class="form-group d-flex flex-column">
            <button :disabled="!toSwapValue" class="btn btn-primary px-3" @click="swap()">
              Swap!
            </button>
          </div>
        </div>
      </div>
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
        console.log("bnb to erc");
        const { jsonSigner } = await getSigner();
        const tokenContract = new Contract(this.fromSwapCurr.value, erc20TokenContractAbi, jsonSigner);
        //
        // console.log(
        //   parseFloat(
        //     await utils.formatUnits((await currentProvider.getBalance(this.fundContractAddress)).toString(), 18)
        //   )
        // );

        if (
          parseFloat(
            await utils.formatUnits((await currentProvider.getBalance(this.fundContractAddress)).toString(), 18)
          ) > 0
        ) {
          const res = await this.fundContract.swapETHToERC20(
            this.toSwapCurr.value,
            FixedNumber.from(this.fromSwapValue),
            0
          );

          return res;
        } else {
          alert("Yuo don't have enough BNB");
        }
      } else if (this.toSwapCurr.label === "BNB") {
        console.log("erc to bnb");
        const { jsonSigner } = await getSigner();
        const tokenContract = new Contract(this.fromSwapCurr.value, erc20TokenContractAbi, jsonSigner);
        if (
          parseFloat(await utils.formatUnits(await tokenContract.balanceOf(this.fundContractAddress.toString()), 18)) >
          0
        ) {
          const res = await this.fundContract.swapERC20ToETH(
            this.toSwapCurr.value,
            FixedNumber.from(this.fromSwapValue),
            0
          );

          // console.log(res);

          return res;
        } else {
          alert(`You need thia amount of ${this.fromSwapCurr.label}`);
        }
      } else {
        console.log("erc to erc");
        const { jsonSigner } = await getSigner();
        const tokenContract = new Contract(this.fromSwapCurr.value, erc20TokenContractAbi, jsonSigner);
        if (
          parseFloat(await utils.formatUnits(await tokenContract.balanceOf(this.fundContractAddress.toString()), 18)) >
          0
        ) {
          const res = await this.fundContract.swapERC20ToERC20(
            this.fromSwapCurr.value,
            this.toSwapCurr.value,
            FixedNumber.from(this.fromSwapValue),
            0
          );

          return res;
        } else {
          alert(`You need to get this anount of ${this.fromSwapCurr.label}`);
        }
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

<style scoped>
.trade {
}

input {
  width: 320px;
}
</style>
