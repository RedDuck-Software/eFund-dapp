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
                :step="0.1"
                :max="fromSwapMaxValue"
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
                :step="0.1"
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
import { BigNumber, utils } from "ethers";
import { currentProvider } from "../services/ether";
import { FundService } from "../services/fundService";
import { mapGetters, mapMutations } from "vuex";
import { asyncLoading } from "vuejs-loading-plugin";

export default {
  name: "FundTrade",
  computed: {
    ...mapGetters(["fundContractAddress", "eFundNetworkSettings", "allowedTokensAddresses", "fundBalance"]),
    boughtTokensAddresses() {
      return this.$store.state.boughtTokensAddresses;
    },
  },
  data() {
    return {
      tokensList: [],

      fromSwapMaxValue: 100,

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
      swapRouterAddress: null,
      fundContract: null,
      fundService: null,
    };
  },
  async mounted() {
    this.fundService = new FundService(this.eFundNetworkSettings, currentProvider());
    this.fundContract = await this.fundService.getFundContractInstance(this.fundContractAddress);
    this.swapRouterAddress = await this.fundContract.router();

    console.log("Swap router address is: ", this.swapRouterAddress);

    this.swapRouterContract = this.fundService.getSwapRouterContractInstance(this.swapRouterAddress);

    const wCrypto = this.eFundNetworkSettings.cryptoSign;
    const wCryptoAddress = this.eFundNetworkSettings.wrappedCryptoAddress;

    const wCryptoObj = {
      name: wCrypto,
      address: wCryptoAddress,
      amount: utils.formatEther(await this.fundService.getCurrentProvider().getBalance(this.fundContractAddress)),
    };

    this.fromSwapList[wCrypto] = wCryptoObj;
    this.fromSwapLabels.push(wCrypto);

    console.log("bought token addresses before foreach: ", this.boughtTokensAddresses, {
      length: this.boughtTokensAddresses.length,
    });

    for (let i = 0; i < this.boughtTokensAddresses.length; i++) {
      const token = this.boughtTokensAddresses[i];
      this.addTokenToBoughts(token);
    }

    console.log("bought tokens addresses: ", this.fromSwapLabels);

    const tokensToSwap =
      this.allowedTokensAddresses.length != 0 ? this.allowedTokensAddresses : this.eFundNetworkSettings.tokensAddresses;

    tokensToSwap.forEach((token) => {
      this.toSwapList[token.name] = token;
      this.toSwapLabels.push(token.name);
    });

    this.toSwapList[wCrypto] = wCryptoObj;
    this.toSwapLabels.push(wCrypto);

    console.log("tokens to swap: ", tokensToSwap);
    console.log("tokens to swap labels: ", this.toSwapLabels);
  },
  methods: {
    addTokenToBoughts(token) {
      this.fromSwapList[token.name] = token;
      this.fromSwapLabels.push(token.name);
    },
    filterToLabels(labels) {
      return labels.filter((item) =>
        this.fromSwapCurr == null
          ? true
          : this.toSwapList[item].address.toLowerCase() != this.fromSwapCurr.address.toLowerCase()
      );
    },
    async setMaxFrom() {
      if (this.fromSwapCurr != null) {
        this.fromSwapValue = await this.getMaxValueOf(this.fromSwapCurr.address);

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

      if (this.toSwapCurr != null && this.toSwapCurr.address.toLowerCase() == this.fromSwapCurr.address.toLowerCase()) {
        this.toSwapCurr = null;
        this.toSwapValue = 0;
        this.toSwapCurrLabel = null;
      }
      this.fromSwapMaxValue = this.fundBalance;

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
      asyncLoading(this.sendSwapRequest())
        .then((txHash) => {
          console.log(txHash);
          this.resetInputPriceValues();
        })
        .catch((ex) => {
          alert("Swap error: ", ex);
        });
    },
    resetInputPriceValues() {
      this.toSwapValue = 0;
      this.fromSwapValue = 0;
    },
    async sendSwapRequest() {
      const wCrypto = this.eFundNetworkSettings.wrappedCryptoAddress;

      const availableTokenAddresses = [];

      this.toSwapLabels.forEach((t) => {
        availableTokenAddresses.push(this.toSwapList[t].address);
      });

      console.log("available tokens: ", availableTokenAddresses);

      if (this.fromSwapCurr.address == wCrypto) {
        return await this.swapETHForTokens();
      } else if (this.toSwapCurr.address == wCrypto) {
        return await this.swapERCForETH();
      } else {
        const path = await this.fundService.findOptimalPathForSwap(
          this.fromSwapCurr.address,
          this.toSwapCurr.address,
          availableTokenAddresses,
          this.fundService.getSwapFactoryAddress(this.swapRouterAddress)
        );

        console.log(path);

        if (path == null) {
          alert(`Cannot swap ${this.fromSwapCurr.name} to ${this.toSwapCurr.name} - no optimal path `);
          return;
        }

        if (path.length > 2) {
          alert("Warning: no direct swap, complex path is using.");
        }

        return await this.swapERCForERC(path);
      }
    },

    async swapERCForERC(path) {
      console.log("erc to erc");

      const tokenFrom = this.fundService.getERC20ContractInstance(this.fromSwapCurr.address);
      const tokenTo = this.fundService.getERC20ContractInstance(this.toSwapCurr.address);

      const amount = utils.parseUnits(this.fromSwapValue, await tokenFrom.decimals());

      console.log("amount ", amount);

      if ((await tokenFrom.balanceOf(this.fundContractAddress)).lt(amount)) {
        alert(`You need to get this amount of ${this.fromSwapCurr.name}`);
        return;
      }

      const tx = await this.fundContract.swapERC20ToERC20(path, amount, 0);

      const txHash = await tx.wait();

      if (!this.boughtTokensAddresses.some((v) => v.address == this.toSwapCurr.address)) {
        const newBoughtToken = {
          name: await tokenTo.symbol(),
          address: this.toSwapCurr.address,
          amount: await tokenTo.balanceOf(this.fundContractAddress),
        };

        this.addTokenToBoughts(newBoughtToken);
        this.addBoughtToken(newBoughtToken);
      } else {
        // todo: update token1 balance
      }

      // todo: update token0 balance

      return txHash;
    },
    async swapERCForETH() {
      console.log("erc to bnb|eth");

      const tokenFrom = this.fundService.getERC20ContractInstance(this.fromSwapCurr.address);

      const amount = utils.parseEther(this.toSwapValue);

      if ((await tokenFrom.balanceOf(this.fundContractAddress)).lt(amount))
        alert(`You need thia amount of ${this.fromSwapCurr.label}`);
      const tx = await this.fundContract.swapERC20ToETH(this.fromSwapCurr.address, amount, 0);

      const txHash = await tx.wait();

      this.updateFundBalance(
        utils.formatEther(await this.fundService.getCurrentProvider().getBalance(this.fundContractAddress))
      );

      return txHash;
    },
    async swapETHForTokens() {
      console.log("bnb to erc");

      const amount = utils.parseEther(this.fromSwapValue);

      const tokenTo = this.fundService.getERC20ContractInstance(this.toSwapCurr.address);

      if ((await this.fundService.getCurrentProvider().getBalance(this.fundContractAddress)).lt(amount))
        alert(`You don't have enough ${this.eFundNetworkSettings.cryptoSign}`);

      const tx = await this.fundContract.swapETHToERC20(this.toSwapCurr.address, amount, 0);

      const txHash = await tx.wait();

      if (!this.boughtTokensAddresses.some((v) => v.address == this.toSwapCurr.address)) {
        const newBoughtToken = {
          name: await tokenTo.symbol(),
          address: this.toSwapCurr.address,
          amount: await tokenTo.balanceOf(this.fundContractAddress),
        };

        this.addTokenToBoughts(newBoughtToken);
        this.addBoughtToken(newBoughtToken);
      } else {
        // todo: update token balance
      }

      this.updateFundBalance(
        utils.formatEther(await this.fundService.getCurrentProvider().getBalance(this.fundContractAddress))
      );

      return txHash;
    },
    async getPricesPath(amount, path) {
      if (amount.isZero()) {
        return new Array(path.length).fill(BigNumber.from([0]));
      } else {
        return await this.swapRouterContract.getAmountsOut(amount, path);
      }
    },
    ...mapMutations(["addBoughtToken", "updateFundBalance"]),
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
