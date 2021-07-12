<template>
  <div class="create-fund-form d-flex flex-column align-content-center">
    <div class="bg-gray-dark rounded px-5 py-4 my-4">
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
                class="form-control bg-dark border-0"
                @change="handleFromValueChange()"
              />
            </div>
            <div class="form-input">
              <select
                v-model="fromSwapCurrLabel"
                class="form-control pl-2 pr-4 bg-dark border-0"
                @change="handleFromValueChange()"
              >
                <option v-for="(item, index) in fromSwapLabels" :key="index" :value="item">
                  {{ item }}
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
                class="form-control bg-dark border-0"
                @change="handleToValueChange()"
              />
            </div>
            <div class="form-input">
              <select
                v-model="toSwapCurrLabel"
                class="form-control pl-2 pr-4 bg-dark border-0"
                @change="handleToValueChange()"
              >
                <option v-for="(item, index) in filterToLabels(toSwapLabels)" :key="index" :value="item">
                  {{ item }}
                </option>
              </select>
            </div>
          </div>
          <div class="form-group d-flex flex-column">
            <button :disabled="!toSwapValue" class="btn btn-primary px-3" @click="swap()">Swap!</button>
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
import { FundService } from "../services/fundService";
import { pancakeRouterContractAbi, erc20TokenContractAbi } from "../constants";
import { mapGetters } from "vuex";

export default {
  name: "FundTrade",
  computed: {
    ...mapGetters(["fundContractAddress", "eFundNetworkSettings", "allowedTokensAddresses"]),
    boughtTokensAddresses() {
      return this.$store.state.boughtTokensAddresses;
    },
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

    console.log("bought token addresses before foreach: ", this.boughtTokensAddresses, {
      length: this.boughtTokensAddresses.length,
    });

    for (let i = 0; i < this.boughtTokensAddresses.length; i++) {
      const token = this.boughtTokensAddresses[i];

      console.log("token push: ", token.name);

      this.fromSwapList[token.name] = token;
      this.fromSwapLabels.push(token.name);
    }

    console.log("bought tokens addresses: ", this.fromSwapLabels);

    const tokensToSwap =
      this.allowedTokensAddresses.length != 0 ? this.allowedTokensAddresses : this.eFundNetworkSettings.tokensAddresses;

    tokensToSwap.forEach((token) => {
      this.toSwapList[token.name] = token;
      this.toSwapLabels.push(token.name);
    });

    console.log("tokens to swap: ", tokensToSwap);
    console.log("tokens to swap labels: ", this.toSwapLabels);
  },
  methods: {
    filterToLabels(labels) {
      return labels.filter((item) => {
        return this.fromSwapCurr == null ? true : item.address != this.fromSwapCurr.address;
      });
    },
    async setMaxFrom() {
      if (this.fromSwapCurr != null) {
        this.fromSwapValue = await this.getMaxValueOf(this.fromSwapCurr.address);

        await this.reCalculateAmountsOut();
      }
    },
    async setMaxTo() {
      if (this.toSwapCurr != null) {
        this.toSwapValue = await this.getMaxValueOf(this.toSwapCurr.address);
        await this.reCalculateAmountsOut();
      }
    },
    async getMaxValueOf(tokenAddress) {
      if (tokenAddress == this.eFundNetworkSettings.wrappedCryptoAddress) {
        return await this.fundService.getBalanceFormatted(this.fundContractAddress);
      } else {
        return await this.fundService.balanceOfFormatted(tokenAddress, this.fundContractAddress);
      }
    },
    async handleFromValueChange() {
      this.fromSwapCurr = this.fromSwapList[this.fromSwapCurrLabel];

      console.log(this.fromSwapCurr);

      await this.reCalculateAmountsOut();
    },
    async handleToValueChange() {
      this.toSwapCurr = this.toSwapList[this.toSwapCurrLabel];

      console.log(this.toSwapCurr);

      await this.reCalculateAmountsOut();
    },
    async reCalculateAmountsOut() {
      if (!(this.fromSwapValue != 0 && this.fromSwapCurr && this.toSwapCurr)) {
        console.log("cannot recalculate amounts out");
        return;
      }

      const token = this.fundService.getERC20ContractInstance(this.fromSwapCurr.address);
      const decimals = await token.decimals();
      const parsedAmount = utils.parseUnits(this.fromSwapValue, decimals);
      console.log("before amounts: ", this.fromSwapCurr.address, this.toSwapCurr.address);

      const amounts = await this.getPricesPath(parsedAmount, [this.fromSwapCurr.address, this.toSwapCurr.address]);

      console.log(amounts);

      this.toSwapValue = utils.formatUnits(amounts[1].toString(), 18);
    },
    async swap() {
      const txhash = await this.sendSwapRequest();
      console.log(txhash);
    },
    async sendSwapRequest() {
      const wCrypto = this.eFundNetworkSettings.wrappedCryptoAddress;

      const availableTokenAddresses = [];

      this.toSwapLabels.forEach((t) => {
        availableTokenAddresses.push(this.toSwapList[t].address);
      });

      console.log("available tokens: ", availableTokenAddresses);

      const path = await this.fundService.findOptimalPathForSwap(
        this.fromSwapCurr.address,
        this.toSwapCurr.address,
        availableTokenAddresses
      );

      console.log(path);

      if (path == null) {
        alert(`Cannot swap ${this.fromSwapCurr.name} to ${this.toSwapCurr.name} - no optimal path `);
        return;
      }

      if (this.fromSwapCurr.address == wCrypto) {
        return await this.swapETHForTokens();
      } else if (this.toSwapCurr.address == wCrypto) {
        return await this.swapERCForETH();
      } else {
        return await this.swapERCForERC(path);
      }
    },
    async swapERCForERC(path) {
      console.log("erc to erc");

      const tokenFrom = this.fundService.getERC20ContractInstance(this.fromSwapCurr.address);
      const tokenTo = this.fundService.getERC20ContractInstance(this.toSwapCurr.address);

      const amount = utils.parseUnits(this.fromSwapValue, await tokenFrom.decimals());

      if ((await tokenFrom.balanceOf(this.fundContractAddress)).lt(amount)) {
        alert(`You need to get this amount of ${this.fromSwapCurr.name}`);
        return;
      }

      return await this.fundContract.swapERC20ToERC20(path, amount, 0);
    },
    async swapERCForETH() {
      console.log("erc to bnb|eth");

      const tokenFrom = this.fundService.getERC20ContractInstance(this.fromSwapCurr.address);

      const amount = utils.parseEther(this.toSwapValue);

      if ((await tokenFrom.balanceOf(this.fundContractAddress)).lt(amount))
        alert(`You need thia amount of ${this.fromSwapCurr.label}`);

      return await this.fundContract.swapERC20ToETH(this.fromSwapCurr.address, amount, 0);
    },
    async swapETHForTokens() {
      console.log("bnb to erc");

      const amount = utils.parseEther(this.fromSwapValue);

      if ((await this.fundService.getCurrentProvider().getBalance(this.fundContractAddress)).lt(amount))
        alert("You don't have enough ETH");

      return await this.fundContract.swapETHToERC20(this.toSwapCurr.address, amount, 0);
    },
    async getPricesPath(amount, path) {
      if (amount.isZero()) {
        return new Array(path.length).fill(BigNumber.from([0]));
      } else {
        return await this.swapRouterContract.getAmountsOut(amount, path);
      }
    },
  },
};
</script>

<style scoped>
input {
  width: 160px;
}
@media (min-width: 768px) {
  input {
    width: 320px;
  }
}
</style>
