<template>
  <!-- todo : fund img -->
  <li class="nav-item mx-0 mx-lg-1">
    <router-link
      class="nav-link py-3 px-0 px-lg-3 rounded text-white"
      :to="{
        name: 'Fund',
        params: {
          address: fundAddress,
        },
      }"
    >
      {{ "Fund name" }}
    </router-link>
  </li>
</template>

<script>
export default {
  name: "FundSmallCard",
  props: ["imgUrl", "fundAddress", "fundName"],
};
</script>
