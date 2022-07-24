<template>
  <div  class="flex flex-row py-3 px-4 hover:bg-gray-50 transition duration-75 cursor-pointer">
    <div id="searchHistoryItem" @mousedown="$emit('search', searchHistoryData)" class="flex-1">{{searchHistoryData}}</div>
    <div class="flex items-center">
      <img @mousedown="test" class="w-5 cursor-pointer" src="../assets/images/closeButtonIcon.svg" alt="X">
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchHistoryItem",
  props:['searchHistoryData'],
  methods:{
    test(){
      console.log("sad")
    }
  }
};
</script>

<style></style>
