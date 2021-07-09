<template>
  <div id="app" class="min-vh-100 bg-secondary">
    <Header />
    <div class="main container text-gray">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Header from "./components/Header";
import "./App.scss";

export default {
  name: "App",
  components: {
    Header,
  },
};
</script>

<style lang="scss">
.main {
  padding-top: 80px;
  padding-bottom: 80px;
}
</style>
