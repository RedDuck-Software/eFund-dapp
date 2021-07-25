<template>
  <div class="bg-lightest p-4 rounded box-shadow">
    <div class="row position-relative">
      <div class="swap-icon d-none d-md-block">
        <img :src="require('../assets/images/swap-icon.png')" />
      </div>
      <div class="col-md-6 px-lg-5 pt-2">
        <div>
          <v-select v-model="selectedFrom" :options="tokensList" class="swap-select mr-md-3 mr-lg-0">
            <template slot="selected-option" slot-scope="option" :value="option.id">
              <div class="selected d-flex justify-content-between">
                {{ option.label }}
                <div class="token-icon d-flex ml-lg-3 ml-1 justify-content-center align-items-center">
                  <img :src="require(`../assets/images/${option.icon}`)" />
                </div>
              </div> </template
          ></v-select>
        </div>
        <div class="trade-inputs d-flex flex-column">
          <div class="w-lg-75">
            <div class="label">You spend</div>
            <div class="d-flex">
              <div class="input-group mb-3 font-weight-bold">
                <input
                  id="from-swap"
                  v-model="form.fromSwap"
                  class="light-input"
                  name="profile_name"
                  placeholder="Type here"
                />
                <div class="input-group-append">
                  <span id="basic-addon3" class="">{{ selectedFrom.label }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="gas-fee">
            <div class="label">Gas fee</div>
            <h3 class="middle font-weight-lighter">0.002024 BNB</h3>
          </div>
        </div>
      </div>
      <div class="vl d-none d-md-block"></div>
      <div class="swap-icon-mobile d-block d-md-none">
        <img :src="require('../assets/images/swap-icon.png')" />
      </div>
      <div class="col-md-6 px-lg-5 pt-2">
        <div>
          <v-select v-model="selectedTo" :options="tokensList" class="swap-select ml-md-3 ml-lg-0">
            <template slot="selected-option" slot-scope="option" :value="option.id">
              <div class="selected d-flex justify-content-between">
                {{ option.label }}
                <div class="token-icon d-flex ml-lg-3 ml-1  justify-content-center align-items-center">
                  <img :src="require(`../assets/images/${option.icon}`)" />
                </div>
              </div> </template
          ></v-select>
        </div>
        <div class="trade-inputs d-flex flex-column justify-content-center">
          <div class="">
            <div class="label">You spend</div>
            <div class="d-flex">
              <div class="input-group mb-3 font-weight-bold">
                <input
                  id="to-swap"
                  v-model="form.toSwap"
                  class="light-input"
                  name="profile_name"
                  placeholder="Type here"
                />
                <div class="input-group-append">
                  <span id="basic-addon2" class="">{{ selectedFrom.label }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class=" mx-auto">
        <button type="button" class="btn black-button mt-4 swap-button">
          Converte now
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import vSelect from "vue-select";

export default {
  name: "Trade",
  components: { vSelect },
  data() {
    return {
      publicPath: process.env.BASE_URL,
      selectedFrom: {
        value: "BNB",
        label: "BNB",
        icon: "bnb_icon_transparent.png",
      },
      selectedTo: {
        value: "Dai",
        label: "Dai",
        icon: "Dai_icon.png",
      },
      tokensList: [
        {
          value: "BNB",
          label: "BNB",
          icon: "bnb_icon_transparent.png",
        },
        {
          value: "Dai",
          label: "Dai",
          icon: "Dai_icon.png",
        },
        {
          value: "USDT",
          label: "USDT",
          icon: "usdt_icon_transparent.png",
        },
      ],
      form: {
        fromSwap: 0.1,
        toSwap: 0.1,
      },
    };
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
