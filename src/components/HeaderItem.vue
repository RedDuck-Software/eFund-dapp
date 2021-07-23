<template>
  <router-link v-slot="{ href, isActive, navigate }" :to="to" exact custom>
    <a :href="href" class="nav-link rounded py-3" :class="isActive ? 'active ' : ''" @click="navigate">
      <img :src="`${publicPath}img/${isActive ? menu.activeIcon : menu.icon}`" class="" alt="home" />
      <div>{{ text }}</div>
    </a>
  </router-link></template
>

<script>
export default {
  name: "HeaderItem",
  props: ["menu", "to", "text"],
  data() {
    return {
      publicPath: process.env.BASE_URL,
    };
  },
  computed: {
    icon() {
      if (this.menu.isActive) {
        return this.menu.activeIcon;
      }
      return this.menu.icon;
    },
  },
};
</script>

<style scoped lang="scss">
.nav-link {
  color: white;
  text-align: center;
  font-size: 14px;
  line-height: 17px;

  &.active {
    color: black;
    background: #fff;
  }
}
</style>
