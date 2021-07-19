<template>
  <header class="bg-secondary">
    <nav class="navbar navbar-expand-lg navbar-secondary navbar-shrink d-flex flex-column">
      <a class="navbar-brand" href="/">
        Awesome EFund
      </a>
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

      <div
        id="navbarSupportedContent"
        class="collapse navbar-collapse d-flex justify-content-between min-w-0 d-flex flex-column"
      >
        <ul class="navbar-nav ms-auto flex-column">
          <li class="nav-item mx-0 mx-lg-1">
            <router-link class="nav-link py-3 px-0 px-lg-3 rounded text-white" :to="{ name: 'Home' }">
              Home
            </router-link>
          </li>
          <li class="nav-item mx-0 mx-lg-1">
            <router-link class="nav-link py-3 px-0 px-lg-3 rounded text-white" :to="{ name: 'Profile' }">
              Profile
            </router-link>
          </li>
          <li class="nav-item mx-0 mx-lg-1">
            <router-link class="nav-link py-3 px-0 px-lg-3 rounded text-white" :to="{ name: 'New Fund' }">
              New Fund
            </router-link>
          </li>
        </ul>
        <ul class="navbar-nav ms-auto flex-column">
          <li class="nav-item mx-0 mx-lg-1">
            <router-link class="nav-link py-3 px-0 px-lg-3 rounded text-white" :to="{ name: 'All Funds' }">
              All
            </router-link>
          </li>
          <li v-for="fundIsManager in fundsIsManager" :key="fundIsManager.id" class="nav-item mx-0 mx-lg-1">
            <router-link
              class="nav-link py-3 px-0 px-lg-3 rounded text-white"
              :to="{
                name: 'Fund',
                params: {
                  address: fundIsManager.id,
                },
              }"
            >
              Home
            </router-link>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Header",

  components: {},
  data() {
    return {
      scrollPosition: 0,
      fundsIsManager: [],
    };
  },
  computed: {
    ...mapGetters(["signerAddress", "fundContractIsManager"]),
  },
};
</script>

<style scoped>
header {
  min-height: 100vh;
}

.navbar {
  height: 100%;
}
</style>
