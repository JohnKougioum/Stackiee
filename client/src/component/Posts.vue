<template>
  <div>
    <div v-for="post in posts" :key="post.id" class="pb-4">
      <Post :details="post" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Post from "./Post.vue";
export default {
  name: "Posts",
  props: {
    posts: Object,
  },
  components: {
    Post,
  },
  computed: {
    ...mapGetters(["getPosts"]),
  },
};
</script>

<style>
</style>