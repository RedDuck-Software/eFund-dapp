<template>
  <FundComponent />
</template>

<script>
import { mapGetters } from "vuex";
import { mapMutations } from "vuex";
import Fund from "../components/Fund";


export default {
  name: "Fund",
  components: {
    FundComponent: Fund,
  },
  data() { 
    return  {
      platformAddress : null,
    };
  },
  async mounted() {
    
  },
  methods: {

  },
};
</script>

<style scoped></style>
