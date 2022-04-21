<template>
  <div>
    <div v-for="index in 5" :key="index" class="pb-4">
      <Post />
    </div>
  </div>
</template>

<script>
import Post from "./Post.vue";
export default {
  name: "Posts",
  components: {
    Post,
  },
};
</script>

<style>
</style>