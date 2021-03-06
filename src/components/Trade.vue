<template>
  <div class="bg-lightest p-4 rounded box-shadow">
    <div class="row position-relative">
      <div class="swap-icon d-none d-md-block">
        <img :src="require('../assets/images/swap-icon.png')" />
      </div>
      <div class="col-md-6 px-lg-5 pt-2">
        <div>
          <v-select
            v-model="fromSwapCurrLabel"
            :options="fromSwapLabels"
            :clearable="false"
            @input="handleFromValueChange"
            class="swap-select mr-md-3 mr-lg-0"
          >
            <template slot="selected-option" slot-scope="option" :value="option.id">
              <div class="selected d-flex justify-content-between">
                {{ option.label }}
                <!-- <div class="token-icon d-flex ml-lg-3 ml-1 justify-content-center align-items-center">
                  <img :src="require(`../assets/images/${option.icon}`)" />
                </div> -->
              </div>
            </template>
          </v-select>
        </div>
        <div class="trade-inputs d-flex flex-column">
          <div class="w-lg-75">
            <div class="label">You spend</div>
            <div class="d-flex">
              <div class="input-group mb-3 font-weight-bold">
                <input
                  v-model="fromSwapValue"
                  type="number"
                  :min="0"
                  :max="fromSwapCurr != null ? fromSwapCurr.amount : 0"
                  :step="0.01"
                  name="from swap"
                  v-on:change="handleFromInputChange"
                  id="from-swap"
                  class="light-input"
                  placeholder="Type here"
                />
                <div class="input-group-append">
                  <span id="basic-addon3" class="">{{ fromSwapCurrLabel }}</span>
                </div>
                <span class="label input-from-max" v-on:click="setMaxFrom">max</span>
              </div>
            </div>
          </div>
          <div class="gas-fee">
            <div class="label">Gas fee</div>
            <h3 class="middle font-weight-lighter">~{{ 0.004 }} {{ eFundNetworkSettings.cryptoSign }}</h3>
          </div>
        </div>
      </div>
      <div class="vl d-none d-md-block"></div>
      <div class="swap-icon-mobile d-block d-md-none">
        <img :src="require('../assets/images/swap-icon.png')" />
      </div>
      <div class="col-md-6 px-lg-5 pt-2">
        <div>
          <v-select
            v-model="toSwapCurrLabel"
            :options="toSwapLabels"
            :clearable="false"
            @input="handleToValueChange"
            class="swap-select ml-md-3 ml-lg-0"
          >
            <template slot="selected-option" slot-scope="option" :value="option.id">
              <div class="selected d-flex justify-content-between">
                {{ option.label }}
              </div>
            </template>
          </v-select>
        </div>
        <div class="trade-inputs d-flex flex-column justify-content-center">
          <div class="">
            <div class="label">You`ll get</div>
            <div class="d-flex">
              <div class="input-group mb-3 font-weight-bold">
                <input
                  v-model="toSwapValue"
                  type="number"
                  min="0"
                  :step="0.1"
                  v-on:change="handleToInputChange"
                  id="to-swap"
                  class="light-input"
                  name="profile_name"
                  placeholder="Type here"
                  readonly
                />
                <div class="input-group-append">
                  <span id="basic-addon2" class="">{{ toSwapCurrLabel }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mx-auto">
        <button type="button" class="btn black-button mt-4 swap-button" @click="swap">Convert now</button>
      </div>
    </div>
  </div>
</template>

<script>
import { utils } from "ethers";
import { currentProvider } from "../services/ether";
import { FundService } from "../services/fundService";
import { mapGetters, mapMutations } from "vuex";
import { asyncLoading } from "vuejs-loading-plugin";
import vSelect from "vue-select";
import { getPercentageDiff } from "../services/helpers";

export default {
  name: "FundTrade",
  components: { vSelect },
  computed: {
    ...mapGetters([
      "fundContractAddress",
      "eFundNetworkSettings",
      "allowedTokensAddresses",
      "cryptoBalance",
      "boughtTokensAddresses",
      "totalBalance",
      "baseBalance",
      "fundInfo",
    ]),
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
      swapRouterAddress: null,
      fundContract: null,
      fundService: null,
    };
  },
  async mounted() {
    this.fundService = new FundService(this.eFundNetworkSettings, currentProvider());
    this.fundContract = await this.fundService.getFundContractInstance(this.fundContractAddress);
    this.swapRouterAddress = await this.fundContract.router();

    const wCrypto = this.eFundNetworkSettings.cryptoSign;
    const wCryptoAddress = this.eFundNetworkSettings.wrappedCryptoAddress;

    const wCryptoObj = {
      name: wCrypto,
      address: wCryptoAddress,
      amount: this.fundInfo.balance,
      decimals: 18,
    };

    this.fromSwapList[wCrypto] = wCryptoObj;
    this.fromSwapLabels.push(wCrypto);

    for (let i = 0; i < this.boughtTokensAddresses.length; i++) {
      const token = this.boughtTokensAddresses[i];
      this.addTokenToBoughts(token);
    }

    const tokensToSwap =
      this.allowedTokensAddresses.length != 0 ? this.allowedTokensAddresses : this.eFundNetworkSettings.tokensAddresses;

    tokensToSwap.forEach((token) => {
      this.toSwapList[token.name] = token;
      this.toSwapLabels.push(token.name);
    });

    this.toSwapList[wCrypto] = wCryptoObj;
    this.toSwapLabels.push(wCrypto);

    this.fromSwapCurrLabel = this.fromSwapLabels[0];
    this.fromSwapCurr = this.fromSwapList[this.fromSwapCurrLabel];
  },
  methods: {
    onMaxClick() {},
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
        this.fromSwapValue = this.fromSwapCurr.amount;

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
    async handleFromInputChange() {
      await this.reCalculateAmountsOut();
    },
    async handleFromValueChange() {
      this.fromSwapCurr = this.fromSwapList[this.fromSwapCurrLabel];

      console.log(this.fromSwapCurr);

      if (this.toSwapCurr != null && this.toSwapCurr.address.toLowerCase() == this.fromSwapCurr.address.toLowerCase()) {
        this.toSwapCurr = null;
        this.toSwapValue = 0;
        this.toSwapCurrLabel = null;
      }

      this.fromSwapValue = 0;
      this.toSwapValue = 0;

      await this.reCalculateAmountsOut();
    },
    async handleToInputChange() {
      await this.reCalculateAmountsOut();
    },
    async handleToValueChange() {
      this.toSwapCurr = this.toSwapList[this.toSwapCurrLabel];

      console.log("to swap cur", this.toSwapCurr);

      await this.reCalculateAmountsOut();
    },
    async reCalculateAmountsOut() {
      console.log("trade: ", {
        fromVal: this.fromSwapValue.toString(),
        fromSwapCurr: this.fromSwapCurr,
        toSwapCur: this.toSwapCurr,
      });

      if (!(this.fromSwapValue != 0 && this.fromSwapCurr && this.toSwapCurr)) {
        console.log("cannot recalculate amounts out");
        return;
      }

      const parsedAmount = utils.parseUnits(this.fromSwapValue.toString(), this.fromSwapCurr.decimals);

      console.log("before amounts: ", this.fromSwapCurr.address, this.toSwapCurr.address);

      const amounts = await this.fundService.getPricesPath(this.swapRouterAddress, parsedAmount, [
        this.fromSwapCurr.address,
        this.toSwapCurr.address,
      ]);

      console.log(amounts);

      this.toSwapValue = utils.formatUnits(amounts[1].toString(), this.toSwapCurr.decimals);
    },
    async swap() {
     // if (this.fromSwapCurr.amount < this.fromSwapValue) {
     //   alert(`Insufficient amount of ${this.fromSwapCurr.name}. Current amount: ${this.fromSwapCurr.amount}, provided: ${this.fromSwapValue} `);
     //   return;
     // }

      asyncLoading(this.sendSwapRequest())
        .then((txHash) => {
          console.log(txHash);
          this.resetInputPriceValues();
        })
        .catch((ex) => {
          alert("Swap error: ", ex);
          console.error(ex);
        });
    },
    resetInputPriceValues() {
      this.toSwapValue = 0;
      this.fromSwapValue = 0;
    },
    async addSwapToTradeHistory(
      tokenFrom,
      tokenTo,
      amountFrom,
      amountTo,
      balanceAfterSwap,
      balanceBeforeSwap,
      timestamp
    ) {
      const clonedTokenFrom = JSON.parse(JSON.stringify(tokenFrom));
      clonedTokenFrom.amount = amountFrom;

      const clonedTokenTo = JSON.parse(JSON.stringify(tokenTo));
      clonedTokenTo.amount = amountTo;

      this.addFundSwapHistoryWithDetails({
        tokenTo: clonedTokenTo,
        tokenFrom: clonedTokenFrom,
        roi: 100 + getPercentageDiff(this.baseBalance, this.totalBalance),
        balanceAfterSwap: balanceAfterSwap,
        balanceBeforeSwap: balanceBeforeSwap,
        timestamp: timestamp,
      });
    },
    async sendSwapRequest() {
      const wCrypto = this.eFundNetworkSettings.wrappedCryptoAddress;

      const availableTokenAddresses = [];

      this.toSwapLabels.forEach((t) => {
        availableTokenAddresses.push(this.toSwapList[t].address);
      });

      console.log("available tokens: ", availableTokenAddresses);

      if (this.fromSwapCurr.address == wCrypto) {
        return await this.swapETHForERC();
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

      const amount = utils.parseUnits(this.fromSwapValue.toString(), await tokenFrom.decimals());

      const tx = await this.fundContract.swapERC20ToERC20(path, amount, 0);

      const txHash = await tx.wait();

      console.log(txHash);

      const eFundEventIndex = txHash.events.length - 1;

      const swapAmountFromParsed = parseFloat(
        utils.formatUnits(txHash.events[eFundEventIndex].args._amountFrom, this.fromSwapCurr.decimals)
      );

      const swapAmountToParsed = parseFloat(
        utils.formatUnits(txHash.events[eFundEventIndex].args._amountTo, this.toSwapCurr.decimals)
      );

      const tokenToEtherPrice = await this.fundService.getTokenPriceInETH(
        this.toSwapCurr.address,
        utils.parseUnits(swapAmountToParsed.toString(), this.toSwapCurr.decimals)
      );

      const tokenFromEtherPrice = await this.fundService.getTokenPriceInETH(
        this.fromSwapCurr.address,
        utils.parseUnits(swapAmountFromParsed.toString(), this.fromSwapCurr.decimals)
      );

      if (!this.boughtTokensAddresses.some((v) => v.address.toLowerCase() == this.toSwapCurr.address.toLowerCase())) {
        const newBoughtToken = {
          name: tokenTo.name,
          address: this.toSwapCurr.address,
          decimals: this.toSwapCurr.decimals,
          amount: swapAmountToParsed,
          etherPrice: tokenToEtherPrice,
          logo: this.fundService.getLogoByAddress(this.toSwapCurr.address),
        };

        this.addTokenToBoughts(newBoughtToken);
        this.addBoughtToken(newBoughtToken);
      } else {
        this.addBoughtTokenAmount({
          address: this.toSwapCurr.address,
          newAmount: swapAmountToParsed,
          newEtherPrice: tokenToEtherPrice,
        });
      }

      this.addBoughtTokenAmount({
        address: this.fromSwapCurr.address,
        newAmount: -swapAmountFromParsed,
        newEtherPrice: -tokenFromEtherPrice,
      });

      var amountFromInETH = await this.fundService.getTokenPriceInETH(
        this.fromSwapCurr.address,
        utils.parseUnits(swapAmountFromParsed.toString(), this.fromSwapCurr.decimals)
      );

      var amountToInETH = await this.fundService.getTokenPriceInETH(
        this.toSwapCurr.address,
        utils.parseUnits(swapAmountToParsed.toString(), this.toSwapCurr.decimals)
      );

      this.updateTotalBalance(this.totalBalance - amountFromInETH + amountToInETH);

      return txHash;
    },
    async swapERCForETH() {
      const amount = utils.parseEther(this.fromSwapValue);

      const tx = await this.fundContract.swapERC20ToETH(this.fromSwapCurr.address, amount, 0);

      const txHash = await tx.wait();

      const eFundEventIndex = txHash.events.length - 1;

      const swapAmountFromParsed = parseFloat(
        utils.formatUnits(txHash.events[eFundEventIndex].args._amountFrom, this.fromSwapCurr.decimals)
      );

      const swapAmountToParsed = parseFloat(utils.formatEther(txHash.events[eFundEventIndex].args._amountTo));

      this.addBoughtTokenAmount({
        address: this.fromSwapCurr.address,
        newAmount: swapAmountFromParsed * -1,
        newEtherPrice: swapAmountToParsed * -1,
      });

      this.updateCryptoBalance(this.cryptoBalance + swapAmountToParsed);

      var amountFromInETH = await this.fundService.getTokenPriceInETH(
        this.fromSwapCurr.address,
        utils.parseUnits(swapAmountFromParsed.toString(), this.fromSwapCurr.decimals)
      );

      this.updateTotalBalance(this.totalBalance - amountFromInETH + swapAmountToParsed);

      this.addSwapToTradeHistory(
        this.fromSwapCurr,
        this.toSwapCurr,
        swapAmountFromParsed,
        swapAmountToParsed,
        this.totalBalance,
        0,
        new Date() / 1000
      );
      return txHash;
    },
    async swapETHForERC() {
      console.log("bnb to erc");

      const amount = utils.parseEther(this.fromSwapValue.toString());

      if ((await this.fundService.getCurrentProvider().getBalance(this.fundContractAddress)).lt(amount))
        alert(`You don't have enough ${this.eFundNetworkSettings.cryptoSign}`);

      const tx = await this.fundContract.swapETHToERC20(this.toSwapCurr.address, amount, 0);

      const txHash = await tx.wait();

      console.log("tx: ", { txHash });

      const eFundEventIndex = txHash.events.length - 1;

      const swapAmountFromParsed = parseFloat(utils.formatEther(txHash.events[eFundEventIndex].args._amountFrom));
      const swapAmountToParsed = parseFloat(
        utils.formatUnits(txHash.events[eFundEventIndex].args._amountTo, this.toSwapCurr.decimals)
      );

      if (!this.boughtTokensAddresses.some((v) => v.address.toLowerCase() == this.toSwapCurr.address.toLowerCase())) {
        const newBoughtToken = {
          name: this.toSwapCurr.name,
          address: this.toSwapCurr.address,
          decimals: this.toSwapCurr.decimals,
          amount: swapAmountToParsed,
          etherPrice: swapAmountFromParsed,
          logo: this.fundService.getLogoByAddress(this.toSwapCurr.address),
        };

        console.log("new bought tokens: ", { newBoughtToken });

        this.addTokenToBoughts(newBoughtToken);
        this.addBoughtToken(newBoughtToken);
      } else {
        console.log("update existing token");

        this.addBoughtTokenAmount({
          address: this.toSwapCurr.address,
          newAmount: swapAmountToParsed,
          newEtherPrice: swapAmountFromParsed,
        });
      }

      this.updateCryptoBalance(this.cryptoBalance - swapAmountFromParsed);

      var amountToInETH = await this.fundService.getTokenPriceInETH(
        this.toSwapCurr.address,
        utils.parseUnits(swapAmountToParsed.toString(), this.toSwapCurr.decimals)
      );

      this.updateTotalBalance(this.totalBalance - swapAmountFromParsed + amountToInETH);

      this.addSwapToTradeHistory(
        this.fromSwapCurr,
        this.toSwapCurr,
        swapAmountFromParsed,
        swapAmountToParsed,
        this.totalBalance,
        0,
        new Date() / 1000
      );

      return txHash;
    },
    ...mapMutations([
      "addBoughtToken",
      "updateCryptoBalance",
      "addBoughtTokenAmount",
      "updateTotalBalance",
      "addFundSwapHistoryWithDetails",
    ]),
  },
};
</script>

<style scoped lang="scss">
.input-group {
  border-bottom: 3px solid #e8e7e7;
  width: auto;
  font-size: 22px;
  color: black;
  flex-wrap: nowrap;
  max-width: 100%;
  align-items: center;
}
.light-input {
  border: none;
  background: none;
  color: black;
  width: auto;
}

.light-input:focus {
  outline: none;
}

.swap-button {
}
.input-from-max {
  cursor: pointer;
  padding: 5px;
}

@media screen and (min-width: 768px) {
  .swap-button {
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translate(-50%, 0);
  }

  .light-input {
    width: 218px;
    max-width: 80%;
  }
}
</style>

<style lang="scss">
.swap-select {
  .vs__dropdown-toggle {
    border: none;
    padding: 0;
  }

  .vs__selected {
    font-size: 22px;
    line-height: 27px;
    margin: 0;
    padding: 0;
    color: black;
  }

  .vs__actions {
    padding: 0;
  }

  .vs__search {
    padding: 0;
    margin: 0;
    width: 1px;
  }

  .vs__selected,
  .selected {
    flex: 1 1 90%;
    align-items: center;
    width: 90%;
  }

  .vs__dropdown-toggle {
    background: #f3f3f3;
    border-radius: 14px;
    padding: 0 12px;
  }

  .token-icon {
    width: 45px;
    height: 45px;
  }
}

.vl {
  border-left: 2px solid #f0f0f0;
  height: 100%;
  position: absolute;
  left: 50%;
  margin-left: -1px;
}

.trade-inputs {
  margin-top: 12px;
  margin-bottom: 12px;
}

.swap-icon {
  position: absolute;
  top: 8px;
  left: 50%;
  margin-left: -24px;
  z-index: 3;
  img {
    width: 48px;
  }
}
.gas-fee {
  margin-top: 12px;
}
.swap-icon-mobile {
  margin: 24px auto;
  img {
    width: 48px;
  }
}

@media screen and (min-width: 768px) {
  .trade-inputs {
    margin-top: 102px;
    margin-bottom: 102px;
  }

  .gas-fee {
    margin-top: 36px;
  }
}
</style>
