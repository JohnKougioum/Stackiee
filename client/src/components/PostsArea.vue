<template>
  <div>
    <div v-for="post in posts" :key="post.id" class="pb-4">
      <PostItem :details="post" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import PostItem from "./PostItem.vue";
export default {
  name: "Posts",
  props: {
    posts: Object,
  },
  components: {
    PostItem,
  },
  computed: {
    ...mapGetters(["getPosts"]),
  },
};
</script>

<style></style>
