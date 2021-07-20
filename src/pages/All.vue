<template>
  <div class="container-fluid">
    <h1>All Funds</h1>
    <div class="row">
      <div class="col-md-4">
        <div class="fund-filters">
          <h2>Fund Settings</h2>
          <h4>Status</h4>
        </div>
      </div>
      <div class="col-md-8">
        <div v-for="(fundChunk, index) in fundsChunks" :key="index" class="row">
          <div v-for="(fund, findex) in fundChunk" :key="findex" class="col-sm-6">
            <Card :title="fund.title" :author="fund.author" />
          </div>
        </div>
      </div>
    </div>
  </div>

  <!--  <FundList :shouldredrawlist="false" />-->
</template>

<script>
import _ from "lodash";
import FundList from "../components/FundList";
import Card from "@/components/Card";

export default {
  name: "All",
  components: { Card },
  data() {
    return {
      funds: [
        { title: "Test Fund", author: " Ben Thomson" },
        { title: "Test Fund1", author: " Ben Thomson1" },
        { title: "Test Fund2", author: " Ben Thomson2" },
        { title: "Test Fund3", author: " Ben Thomson3" },
        { title: "Test Fund4", author: " Ben Thomson3" },
        { title: "Test Fund5", author: " Ben Thomson5" },
        { title: "Test Fund6", author: " Ben Thomson6" },
      ],
      readOnlyFactoryContract: null,
      fetchCount: 0,
    };
  },
  computed: {
    fundsChunks() {
      return _.chunk(Object.values(this.funds), 2);
    },
  },
};
</script>

<style scoped></style>
