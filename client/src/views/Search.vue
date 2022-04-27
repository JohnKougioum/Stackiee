<template>
  <div class="h-auto w-full mt-24 flex md:flex md:justify-center">
    <div class="flex w-full lg:w-1/2 justify-center items-center flex-col">
      <h1>{{ this.err }} {{ this.err ? this.$route.query.s : "" }}</h1>
      <div class="custom-width">
        <Posts :posts="this.posts" />
      </div>
    </div>
  </div>
</template>

<script>
import {
  SET_SEARCHED_POSTS,
  GET_SEARCHED_POSTS,
  SET_MORE_SEARCHED_POSTS,
  GET_NOFOUND_ERROR,
} from "../store/defaults-type";
import { mapGetters, mapActions } from "vuex";
import Posts from "../component/Posts.vue";
export default {
  name: "Search",
  components: {
    Posts,
  },
  mounted() {
    const query = this.$route.query.s;
    this.fetchPosts({ query });
    document.addEventListener("scroll", (e) => {
      if (
        document.documentElement.scrollTop + window.innerHeight ===
        document.documentElement.offsetHeight
      ) {
        let query = this.$route.query.s;
        this.fetchMorePosts({ query });
      }
    });
  },

  computed: {
    ...mapGetters({
      posts: GET_SEARCHED_POSTS,
      err: GET_NOFOUND_ERROR,
    }),
    search() {
      return this.$route.query.s;
    },
  },
  watch: {
    search(value) {
      const query = value;
      this.fetchPosts({ query });
    },
  },
  methods: {
    ...mapActions({
      fetchPosts: SET_SEARCHED_POSTS,
      fetchMorePosts: SET_MORE_SEARCHED_POSTS,
    }),
  },
};
</script>

<style>
</style>