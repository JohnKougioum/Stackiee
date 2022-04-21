<template>
  <div class="h-auto w-full mt-8 flex md:flex md:justify-center">
    <div class="flex w-full lg:w-1/2 justify-center items-center">
      <div class="custom-width">
        <Posts />
      </div>
    </div>
  </div>
</template>

<script>
import Posts from "../component/Posts.vue";
export default {
  name: "Home",
  components: {
    Posts,
  },
  created() {},
};
</script>

<style>
.custom-width {
  width: 640px;
}
</style>