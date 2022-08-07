<template>
  <div class="st-container flex md:flex md:justify-center">
    <div class="flex w-full lg:w-1/2 justify-center items-center flex-col">
      <h1>{{ this.err }} {{ this.err ? this.$route.query.s : "" }}</h1>
      <div class="custom-width">
        <PostsArea :posts="this.posts" />
      </div>
    </div>
  </div>
</template>

<script>
import types from "../store/constants";
import { mapGetters, mapActions } from "vuex";
import PostsArea from "../components/PostsArea.vue";
export default {
  name: "Search",
  components: {
    PostsArea,
  },
  mounted() {
    const query = this.$route.query?.s;

    //TODO beforeDestory delete event listener
    this.fetchPosts({ query });
    document.addEventListener("scroll", (e) => {
      if (
        document.documentElement.scrollTop + window.innerHeight ===
        document.documentElement.offsetHeight
      ) {
        const query = this.$route.query?.s;
        this.fetchMorePosts({ query });
      }
    });
  },

  computed: {
    ...mapGetters({
      posts: types.POSTS.getters.GET_SEARCHED_POSTS,
      err: types.POSTS.getters.GET_NOFOUND_ERROR,
    }),
    search() {
      return this.$route.query ? this.$route.query.s : "";
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
      fetchPosts: types.POSTS.actions.FETCH_SEARCHED_POSTS,
      fetchMorePosts: types.POSTS.actions.FETCH_MORE_SEARCHED_POSTS,
    }),
  },
};
</script>

<style></style>
