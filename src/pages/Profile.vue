<template>
  <div>
    <div v-if="isLoading">Loading...</div>
    <div v-else class="container-fluid">
      <h1 class="mb-3 font-weight-bold">Profile</h1>

      <div class="row">
        <div v-if="shouldShowProfileEditingForm" class="col-sm-6 col-lg-4">
          <div class="form-create bg-lightest box-shadow rounded d-flex flex-column">
            <fieldset v-if="step === 1" class="mb-0 form-group d-flex flex-column">
              <div class="">
                <h2 class="mb-3">Your name</h2>
                <input
                  id="profile_name"
                  v-model="form.name"
                  class="form-control custom-input"
                  name="profile_name"
                  placeholder="Type here"
                />
              </div>
              <div class="mt-3 mb-2"></div>

              <div class="mt-auto text-center">
                <button type="button" class="btn black-button" @click="nextStep">Next Step</button>
              </div>
            </fieldset>
            <fieldset v-if="step === 2" class="mb-0 form-group d-flex flex-column">
              <div class="">
                <h2>Your Your avatar (optional)</h2>
                <div class="text-center">
                  <label class="btn green-button mt-4" style="display: block">
                    <input type="file" id="file" ref="file" v-on:change="handleFileUpload()" />
                    Upload
                  </label>
                </div>
                <div class="mt-3 mb-2"></div>
              </div>
              <div class="mt-auto text-center">
                <button type="button" class="btn black-button" @click="nextStep">Next Step</button>
              </div>
            </fieldset>
            <fieldset v-if="step === 3" class="mb-0 form-group d-flex flex-column">
              <div class="">
                <h2>About yourself</h2>
                <textarea
                  v-model="form.description"
                  class="form-control"
                  id="exampleFormControlTextarea1"
                  rows="3"
                ></textarea>
                <div class="mt-3 mb-2"></div>

                <div class="mt-auto text-center">
                  <button type="button" class="btn black-button" @click="nextStep">Next Step</button>
                </div>
              </div>
            </fieldset>
            <fieldset v-if="step === 4 && isSuccessAlertVisible" class="form-group">
              <div class="row">
                <div class="col-sm-12">
                  <div class="text-center">
                    <h2 class="mb-3">Your Profile is successfully filled</h2>
                    <div class="check-filled bg-primary">
                      <img src="../assets/images/check_white.png" />
                    </div>
                  </div>
                </div>
              </div>
            </fieldset>
            <div class="mt-4 pt-2">
              <ul v-if="step < totalSteps" class="d-flex justify-content-center">
                <li>
                  <div class="line" :class="step >= 1 ? 'bg-primary' : ''"></div>
                </li>
                <li class="mx-1">
                  <div class="line" :class="step >= 2 ? 'bg-primary' : ''"></div>
                </li>
                <li>
                  <div class="line" :class="step >= 3 ? 'bg-primary' : ''"></div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="col-sm-6 col-lg-4 d-none d-sm-block">
          <div class="card profile-card box-shadow">
            <div class="card-body">
              <div class="row no-gutters">
                <div class="col-md-4">
                  <div class="circular-croper">
                    <a-skeleton
                      :loading="!form.imgLocalPath"
                      active
                      :title="false"
                      :paragraph="false"
                      :avatar="{ shape: 'circle', size: 100 }"
                    >
                      <img class="card-img-top round-img" :src="form.imgLocalPath" alt="test fund" />
                    </a-skeleton>
                  </div>
                </div>

                <div class="col-md-8">
                  <a-skeleton :loading="!form.name" active :title="{ width: 200 }" :paragraph="{ rows: 1, width: 100 }">
                    <h2 class="card-title pt-2 pb-1">{{ form.name }}</h2>
                    <h3>Manager/investor</h3>
                  </a-skeleton>
                </div>
              </div>
              <div class="mt-4 mb-3">
                <a-skeleton :loading="!form.imgLocalPath || !form.name" active :title="false" :paragraph="{ rows: 3 }">
                  <div class="d-flex flex-wrap">
                    <div class="desc-item label mr-3">
                      Funds count as manager: <span class="text-black">{{ userFundsAsManager.length }}</span>
                    </div>
                    <div class="desc-item label mr-3">
                      Average ROI:
                      <span class="text-black">150%</span>
                    </div>
                    <div v-if="userDeposits.length != 0" class="desc-item label mr-3">
                      Invested:
                      <span class="text-black">{{ userInvestedTotal }} {{ eFundNetworkSettings.cryptoSign }}</span>
                    </div>
                  </div>
                </a-skeleton>
              </div>
            </div>
          </div>
        </div>
        <div v-show="false" class="col-sm-6 col-lg-4">
          <div class="balance-card">
            <div class="card-body">
              <div class="select-wrap flex-grow-1">
                <div>
                  <v-select v-model="selectedToken" :clearable="false" :options="tokensList" class="token-select" />
                  <div class="label">Fund value</div>
                </div>
              </div>
              <div class="text-center mt-md-0 mt-3">
                <h2 class="">{{ currentBalance }} {{ selectedToken === "BNB" ? "BNB" : "$" }}</h2>
                <div class="label">Total Balance</div>
              </div>
              <div class="text-center mt-md-0 mt-3">
                <h2 class="">{{ currentRevenue }} {{ selectedToken === "BNB" ? "BNB" : "$" }}</h2>
                <div class="label">Revenue ({{ selectedToken }})</div>
              </div>
              <div v-if="fundContractStatus != 'Opened'" class="text-center mt-md-0 mt-3 ml-4 ml-md-0">
                <h2 v-if="totalBalance > baseBalance" class="text-primary">&#x2191;{{ currentRoi.toFixed(2) }}</h2>
                <h2 v-else-if="totalBalance == baseBalance">&#x21E1;100</h2>
                <h2 v-else class="text-danger">&#x2193;{{ currentRoi.toFixed(2) }}</h2>

                <div class="label">ROI</div>
              </div>
            </div>
          </div>
          <div class="wallet-card box-shadow mt-4">
            <div class="card-body">
              <h2>
                Wallet: <span>{{ userAddress }}</span>
              </h2>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-3"></div>
      <div>
        <div>
          <h2 v-if="userFundsAsManager.length > 0">Funds as manager:</h2>
          <div class="c-row">
            <div v-for="(fund, index) in userFundsAsManager" :key="index" class="fund-card">
              <FundCard :fund-info="fund" />
            </div>
          </div>
        </div>

        <div>
          <h2 v-if="userFundsAsInvestor.length > 0">Funds as investor:</h2>
          <div class="c-row">
            <div v-for="(fund, index) in userFundsAsInvestor" :key="index" class="fund-card">
              <FundCard :fund-info="fund" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import {
  getGenericSignNonce,
  getPercentageDiff,
  getUserByAddress,
  registerUser,
  updateUser,
} from "../services/helpers";
import { currentProvider } from "../services/ether";
import { FundService } from "../services/fundService";
import { utils } from "ethers";
import { DEFAULT_IMG_URL } from "../constants";
import vSelect from "vue-select";
import FundCard from "../components/FundCard.vue";

export default {
  name: "Profile",
  components: { vSelect, FundCard },
  data() {
    return {
      step: 1,
      selectedToken: "USDT",
      totalSteps: 4,
      form: {
        name: "",
        description: null,
        image: null,
        imgLocalPath: null,
      },
      currentUserInfo: null,
      userAddress: null,
      getUserApiQueryFailed: false,
      userFundsAsManager: [],
      userFundsAsInvestor: [],
      userDeposits: [],
      fundService: null,
      isLoading: true,
      isSuccessAlertVisible: true,
    };
  },
  computed: {
    ...mapGetters(["totalBalance", "eFundNetworkSettings", "fundContractStatus", "endBalance", "baseBalance"]),
    currentRoi() {
      return 100 + getPercentageDiff(this.baseBalance, this.totalBalance);
    },
    tokensList() {
      return [this.eFundNetworkSettings.cryptoSign, "USDT"];
    },
    currentRevenue() {
      return 0;
    },
    currentBalance() {
      return 0;
    },
    DEFAULT_IMG_URL() {
      return DEFAULT_IMG_URL;
    },
    shouldShowProfileEditingForm() {
      return this.signerAddress == this.userAddress && !this.getUserApiQueryFailed;
    },
    userInvestedTotal() {
      let total = 0;

      this.userDeposits.forEach((deposit) => {
        console.log("deposit : ", deposit);

        total += parseFloat(utils.formatEther(utils.parseEther(deposit.amount.toString())));

        console.log(deposit);
      });

      return total;
    },
    ...mapGetters([
      "signerAddress",
      "eFundNetworkSettings",
      "userProfileData",
      "myFundsAsInvestor",
      "myFundsAsManager",
    ]),
  },
  async mounted() {
    await this.loadProfileData();
    this.isLoading = false;
  },
  methods: {
    async loadProfileData() {
      this.userAddress = utils.getAddress(this.$route.params.address);

      this.fundService = new FundService(this.eFundNetworkSettings, currentProvider());

      console.log(this.eFundNetworkSettings.chainId);

      let currentUserInfo;

      let userFundsAsManager;
      let userFundsAsInvestor;
      if (this.userAddress.toLowerCase() == this.signerAddress.toLowerCase()) {
        currentUserInfo = this.userProfileData;
        userFundsAsManager = this.myFundsAsManager;
        userFundsAsInvestor = this.myFundsAsInvestor;
      } else {
        userFundsAsManager = await this.fundService.getAllManagerFunds(this.userAddress);
        userFundsAsInvestor = await this.fundService.getAllInvestorsFunds(this.userAddress);

        console.log("user funds: ", { asManager: this.userFundsAsManager, asInvestor: this.userFundsAsInvestor });
        try {
          currentUserInfo = await getUserByAddress(this.userAddress, this.eFundNetworkSettings.chainId);
        } catch (error) {
          this.getUserApiQueryFailed = true;
        }
      }

      this.userFundsAsManager = await Promise.all(
        userFundsAsManager.map((v) => this.fundService.getFundDetails(v.address))
      );

      this.userFundsAsInvestor = await Promise.all(
        userFundsAsInvestor.map((v) => this.fundService.getFundDetails(v.address))
      );

      if (this.userFundsAsInvestor.length != 0) {
        const res = this.userFundsAsInvestor.map((v) => v.deposits).flat();

        console.log("deposits ", res);
        res
          .filter((v) => v.owner.toLowerCase() == this.userAddress.toLowerCase())
          .forEach((deposit) => {
            console.log(deposit);

            this.userDeposits.push(deposit);
          });
      }

      this.currentUserInfo = currentUserInfo == "" || !currentUserInfo ? null : currentUserInfo;

      console.log("current user info: ", this.currentUserInfo);

      if (this.currentUserInfo != null) {
        this.form.name = this.currentUserInfo.username;
        this.form.description = this.currentUserInfo.username;
        this.form.imgLocalPath = this.currentUserInfo.imageUrl;
      }
    },

    async nextStep() {
      if (this.step == 3) {
        await this.updateProfileInfo();
      }

      this.step++;
    },
    async updateProfileInfo() {
      var newNonce;

      // register user if not registered yet
      if (this.currentUserInfo == null || !this.currentUserInfo) {
        const genericNonce = await getGenericSignNonce();

        const signedNonce = await this.fundService.signMessage(genericNonce);

        newNonce = await registerUser(
          {
            signedNonce: signedNonce,
            address: this.signerAddress,
            username: this.form.name,
            description: this.form.description,
          },
          this.form.image,
          this.eFundNetworkSettings.chainId
        );

        this.currentUserInfo = {
          username: this.form.name,
          description: this.description,
          imageUrl: this.imgLocalPath,
          singNonce: newNonce,
        };
        // update info of already existing user
      } else {
        console.log("cur user info: ", this.currentUserInfo);

        const signedNonce = await this.fundService.signMessage(this.currentUserInfo.signNonce, "No password required.");

        newNonce = await updateUser(
          {
            signedNonce: signedNonce,
            address: this.signerAddress,
            username: this.form.name == null ? this.currentUserInfo.username : this.form.name,
            description: this.form.description == null ? this.currentUserInfo.description : this.form.description,
          },
          this.form.image,
          this.eFundNetworkSettings.chainId
        );
      }

      this.updateUserProfileData({
        address: this.signerAddress,
        username: this.form.name == null ? this.currentUserInfo.username : this.form.name,
        description: this.form.description == null ? this.currentUserInfo.description : this.form.description,
        imageUrl: this.form.imgLocalPath,
        signNonce: newNonce,
      });

      setTimeout(() => {
        this.isSuccessAlertVisible = true;
      }, 2000);
      console.log("New nonce is: ", newNonce);
    },
    handleFileUpload() {
      console.log("handled file upload!");

      this.form.image = this.$refs.file.files[0];

      var reader = new FileReader();

      reader.onloadend = (e) => {
        this.form.imgLocalPath = e.target.result;

        console.log(this.form.imgLocalPath);
      };

      reader.readAsDataURL(this.form.image);
    },

    ...mapMutations(["updateSignerAddress", "updateUserProfileData"]),
  },
};
</script>

<style scoped lang="scss">
input[type="file"] {
  display: none;
}

.balance-card {
  border-radius: 20px;
  background-color: #ffffff;

  h2 {
    font-size: 14px;
    margin: 0;
    color: #9b9b9b;

    span {
      color: #000000;
    }
  }

  .card-body {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
  }
}

.wallet-card {
  display: inline-flex;
  align-items: center;
  border-radius: 30px;
  background-color: #ffffff;

  h2 {
    font-size: 14px;
    margin: 0;
    color: #9b9b9b;

    span {
      color: #000000;
    }
  }

  .card-body {
    padding: 6px 10px;
  }
}
.c-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.check-filled {
  border-radius: 50%;
  width: 87px;
  height: 87px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
}

.form-create {
  position: relative;
  padding: 22px 22px 12px 22px;
  min-height: 237px;

  .form-group {
    flex: 1 0 100%;
  }
}

.custom-input {
  font-size: 16px;
  border: none;
  background: #f0eff8;
  color: #9b9b9b;
}

.line {
  width: 60px;
  height: 3px;
  background: #9b9b9b;
}

.profile-card {
  border: none;

  .card-body {
    padding: 20px 22px 16px 26px;
  }

  .card-img-top {
    padding-right: 26px;
  }
}

.card-img-top {
  //height: 56px;
  //width: auto;
}

.container-fluid {
  margin: 0 15px;
}

.fund-card {
  margin: 15px;
}

@media screen and (max-width: 768px) {
  .card-img-top {
    height: 56px;
    width: auto;
  }
}
</style>
