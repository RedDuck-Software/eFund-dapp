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
      <span @onclick="setMaxFrom()">max</span>
      <select v-model="fromSwapCurrLabel" class="form-control" @change="handleFromValueChange()">
        <option v-for="(item, index) in fromSwapLabels" :key="index" :value="item">
          {{ item }}
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
      <span @onclick="setMaxTo()">max</span>
      <select v-model="toSwapCurrLabel" class="form-control" @change="handleToValueChange()">
        <option v-for="(item, index) in toSwapLabels" :key="index" :value="item">
          {{ item }}
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
import { FundService } from "../services/fundService";
import { pancakeRouterContractAbi, erc20TokenContractAbi } from "../constants";
import { mapGetters } from "vuex";

export default {
  name: "FundTrade",
  computed: {
    ...mapGetters(["fundContractAddress", "eFundNetworkSettings", "boughtTokensAddresses", "allowedTokensAddresses"]),
  },
  data() {
    return {
      tokensList: [],

      fromSwapCurrLabel: "",
      toSwapCurrLabel: "",

      fromSwapCurr: null,
      toSwapCurr: null,

      fromSwapValue: 0,
      toSwapValue: 0,

      fromSwapList: [],
      toSwapList: [],

      fromSwapLabels: [],
      toSwapLabels: [],

      swapRouterContract: null,
      fundContract: null,
      fundService: null,
    };
  },
  async mounted() {
    this.fundService = new FundService(this.eFundNetworkSettings.eFundPlatformAddress, currentProvider);
    this.fundContract = await this.fundService.getFundContractInstance(this.fundContractAddress);
    const swapRouterAddress = await this.fundContract.router();

    console.log("Swap router address is: ", swapRouterAddress);

    this.swapRouterContract = await this.fundService.getSwapRouterContractInstance(swapRouterAddress);

    const wCrypto = this.eFundNetworkSettings.cryptoSign;
    const wCryptoAddress = this.eFundNetworkSettings.wrappedCryptoAddress;

    this.fromSwapList[wCrypto] = {
      name: wCrypto,
      address: wCryptoAddress,
      amount: utils.formatEther(await this.fundService.getCurrentProvider().getBalance(this.fundContractAddress)),
    };

    this.fromSwapLabels.push(wCrypto);

    this.boughtTokensAddresses.forEach((token) => {
      this.fromSwapList[token.name] = token;
      this.fromSwapLabels.push(token.name);
    });

    const tokensToSwap =
      this.allowedTokensAddresses.length != 0 ? this.allowedTokensAddresses : this.eFundNetworkSettings.tokensAddresses;

    console.log(this.eFundNetworkSettings.tokensAddresses);

    tokensToSwap.forEach((token) => {
      this.toSwapList[token.name] = token;
      this.toSwapLabels.push(token.name);
    });
  },
  methods: {
    async setMaxTo() {
      this.fromSwapValue = await this.getMaxValueeOf();
    },
    async setMaxFrom() {
      this.toSwapValue = await this.getMaxValueeOf();
    },
    async getMaxValueeOf(t) {
      return 1000;
    },
    async handleFromValueChange() {
      this.fromSwapCurr = this.fromSwapList[this.fromSwapCurrLabel];

      console.log(this.fromSwapCurr);

      if (this.fromSwapValue != 0 && this.fromSwapCurr && this.toSwapCurr) {
        await this.reCalculateAmountsOut();
      }

      // if (this.fromSwapCurrLabel.value === this.toSwapCurr.value) {
      //   this.toSwapValue = this.fromSwapValue;
      //   return;
      // }

      // if (this.fromSwapValue > 0) {
      //   const amounts = await this.getPricesPath(BigNumber.from(FixedNumber.from(this.fromSwapValue)), [
      //     this.fromSwapCurr.value.toString(),
      //     this.toSwapCurr.value.toString(),
      //   ]);

      //   this.toSwapValue = parseFloat(await utils.formatUnits(amounts[1].toString(), 18)).toFixed(9);
      // }
    },
    async handleToValueChange() {
      this.toSwapCurr = this.toSwapList[this.toSwapCurrLabel];

      console.log(this.toSwapCurr);

      if (this.fromSwapValue != 0 && this.fromSwapCurr && this.toSwapCurr) {
        await this.reCalculateAmountsOut();
      }
      // if (this.fromSwapCurr.value === this.toSwapCurr.value) {
      //   this.fromSwapValue = this.toSwapValue;
      //   return;
      // }
    },
    async reCalculateAmountsOut() {
      const token = this.fundService.getERC20ContractInstance(this.fromSwapCurr.address);
      const decimals = await token.decimals();
      const parsedAmount = utils.parseUnits(this.fromSwapValue, decimals);
      
      const amounts = await this.getPricesPath(parsedAmount, [this.fromSwapCurr.address, this.toSwapCurr.address]);

      console.log(amounts);

      this.toSwapValue = await utils.formatUnits(amounts[1].toString(), 18);
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
        return await this.fundContract.swapERC20ToETH(this.toSwapCurr.value, FixedNumber.from(this.fromSwapValue), 0);
      } else {
        alert(`You need thia amount of ${this.fromSwapCurr.label}`);
      }
    },
    async swapETHForTokens() {
      console.log("bnb to erc");
      const { jsonSigner } = await getSigner();
      const tokenContract = new Contract(this.fromSwapCurr.value, erc20TokenContractAbi, jsonSigner);

      if (!(await currentProvider.getBalance(this.fundContractAddress)).isZero()) {
        return await this.fundContract.swapETHToERC20(this.toSwapCurr.value, FixedNumber.from(this.fromSwapValue), 0);
      } else {
        alert("Yuo don't have enough BNB");
      }
    },
    async getPricesPath(amount, path) {
      if (amount.isZero()) {
        return new Array(path.length).fill(BigNumber.from([0]));
      } else {
        return await this.swapRouterContract.getAmountsOut(amount, path);
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
