<template>
  <div class="balance-card box-shadow">
    <div class="card-body">
      <h2>How much ether you want to invest?</h2>
      <input
        id="profile_name"
        v-model="amount"
        class="form-control custom-input"
        type="number"
        placeholder="Type here"
      />
      <div class="buttons">
        <div class="badge bg-danger text-white" v-on:click="setShowDepositCard(false)">
          Cancel
        </div>
        <div v-if="fundContractStatus === 'Opened'" class="badge bg-primary text-white" v-on:click="invest()">
          Invest
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { utils } from "ethers";
import { asyncLoading } from "vuejs-loading-plugin";
import { mapGetters, mapMutations } from "vuex";
import { FundService } from "../services/fundService";
import { currentProvider } from "../services/ether";

export default {
  name: "DepositAmountCard",
  props: ['setShowDepositCard'],
  data() {
    return {
      amount: null,
      fundService: null,
    };
  },
  computed: {
    ...mapGetters([
      "eFundNetworkSettings",
      "fundContractStatus",
      "fundContractAddress",
    ]),
  },
  mounted: function() {
    this.fundService = new FundService(this.eFundNetworkSettings, currentProvider());
  },
  methods: {
    async invest() {
      const tx = await this.fundService.makeDeposit(this.fundContractAddress, utils.parseEther(this.amount.toString()));

      asyncLoading(tx.wait())
        .then(async (v) => {
          // eslint-disable-next-line no-undef
          this.addFundDeposit({ amount: this.amount, owner: await this.fundService.getCurrentSigner() });
        })
        .catch((ex) => console.error(ex));
      this.setShowDepositCard(false);
    },
    ...mapMutations(["addFundDeposit"]),
  },
};
</script>

<style scoped lang="scss">
.balance-card {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 20px;
  background-color: #ffffff;
  z-index: 1000;
  opacity: 1 !important;

  .card-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 30px;
  }
}
.buttons{
  display: flex;
  align-items: center;
  margin-top: 10px;
  justify-content: space-around;
}

</style>
