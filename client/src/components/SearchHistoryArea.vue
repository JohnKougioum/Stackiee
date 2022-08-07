<template>
  <div class="search--history--area">
    <div class="flex justify-center" v-if="isFetching">
      <SpinnerLoader />
    </div>
    <div v-else>
      <SearchHistoryItem
        @search="test"
        v-for="(data, index) in this.historyData"
        :key="index"
        :searchHistoryData="data"
      />
    </div>
  </div>
</template>

<script>
import SearchHistoryItem from "./SearchHistoryItem.vue";
import SpinnerLoader from "./SpinnerLoader.vue";
import axios from "axios";
export default {
  name: "SearchHistoryArea",
  components: {
    SearchHistoryItem,
    SpinnerLoader,
  },
  data() {
    return {
      isFetching: true,
      historyData: null,
    };
  },
  async mounted() {
    const user = sessionStorage.getItem("user");
    user
      ? await axios
          .get(`http://localhost:5000/api/searchHistory?user=${user}`)
          .then((response) => {
            this.isFetching = false;
            this.historyData = response.data[0].searchHistory;
          })
      : this.emitEmptyHistory();
  },
  methods: {
    test(searchTerm) {
      this.$emit("emittedSearch", searchTerm);
    },
    emitEmptyHistory() {
      this.$emit("emptyHistory");
    },
  },
};
</script>

<style lang="scss" scoped>
.search--history--area {
  @apply absolute top-full left-1 w-full mt-1 py-3 rounded-sm shadow-md bg-white;
}
</style>
