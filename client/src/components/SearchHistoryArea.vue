<template>
  <div class="search--history--area">
    <SearchHistoryItem />
  </div>
</template>

<script>
import SearchHistoryItem from "./SearchHistoryItem";
export default {
  name: "SearchHistoryArea",
  components: {
    SearchHistoryItem,
  },
};
</script>

<style lang="scss" scoped>
.search--history--area {
  @apply absolute top-full left-1 w-full mt-2 py-5 px-5 rounded-sm shadow-md bg-gray-500;
}
</style>
