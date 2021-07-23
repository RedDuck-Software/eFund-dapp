<template>
  <header class="bg-secondary ml-2">
    <nav class="navbar navbar-expand-lg navbar-secondary navbar-shrink d-flex flex-column my-6 p-0">
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div id="navbarSupportedContent" class="collapse navbar-collapse d-flex min-w-0  d-flex flex-column">
        <ul class="navbar-nav ms-auto flex-column bg-darken rounded w-100">
          <li class="nav-item ">
            <HeaderItem :menu="menu.home" :to="{ name: 'Home' }" :text="'Home'" />
          </li>
          <li class="nav-item ">
            <HeaderItem :menu="menu.profile" :to="{ name: 'Profile' }" :text="'Profile'" />
          </li>
          <li class="nav-item  ">
            <HeaderItem :menu="menu.newFund" :to="{ name: 'New Fund' }" :text="'New Fund'" />
          </li>
        </ul>
        <ul class="navbar-nav ms-auto flex-column bg-darken mt-1 rounded w-100">
          <li class="nav-item  ">
            <HeaderItem :menu="menu.newFund" :to="{ name: 'All Funds' }" :text="'All'" />
          </li>
          <li class="nav-item ">
            <HeaderItem
              :menu="menu.fund"
              :text="'fund 1'"
              :to="{
                name: 'Fund',
                params: {
                  address: '0x85c15a561a692be49a0fd3b9e9b1bf8370b33332',
                },
              }"
            />
          </li>
          <li v-for="fundIsManager in fundsIsManager" :key="fundIsManager.id" class="nav-item rounded ">
            <HeaderItem
              :menu="menu.fund"
              :to="{ name: 'Fund', params: { address: fundIsManager.id } }"
              :text="fundIsManager.text"
            />
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
import { mapGetters } from "vuex";
import HeaderItem from "@/components/HeaderItem";

export default {
  name: "Header",
  components: { HeaderItem },
  data() {
    return {
      scrollPosition: 0,
      fundsIsManager: [],
      hover: false,
      menu: {
        home: {
          icon: "menu_home.svg",
          activeIcon: "menu_active_home.svg",
        },
        profile: {
          icon: "menu_profile.svg",
          activeIcon: "menu_active_profile.svg",
        },
        newFund: {
          icon: "menu_new.svg",
          activeIcon: "menu_active_new.svg",
        },
        allFunds: {
          icon: "menu_all.svg",
          activeIcon: "menu_active_all.svg",
        },
        fund: {
          icon: "menu_fund.svg",
          activeIcon: "menu_active_fund.svg",
        },
      },
    };
  },
  computed: {
    ...mapGetters(["signerAddress", "eFundNetworkSettings"]),
  },
};
</script>

<style scoped lang="scss">
header {
  min-height: 100vh;
}

.navbar {
  height: 100%;
}
</style>
