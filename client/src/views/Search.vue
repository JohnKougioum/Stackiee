<template>
  <div class="h-auto w-full mt-24 flex md:flex md:justify-center">
    <div class="flex w-full lg:w-1/2 justify-center items-center">
      <div class="custom-width">
        <Posts :posts="this.getSearchedPosts" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Posts from "../component/Posts.vue";
export default {
  name: "Search",
  components: {
    Posts,
  },
  mounted() {
    const query = this.$route.query.s;
    this.FETCH_SEARCHED_POSTS({ query });
    document.addEventListener("scroll", (e) => {
      if (
        document.documentElement.scrollTop + window.innerHeight ===
        document.documentElement.offsetHeight
      ) {
        let query = this.$route.query.s;
        this.FETCH_MORE_SEARCHED_POSTS({ query });
      }
    });
  },

  computed: {
    ...mapGetters(["getSearchedPosts"]),
    search() {
      return this.$route.query.s;
    },
  },
  watch: {
    search(value) {
      const query = value;
      this.FETCH_SEARCHED_POSTS({ query });
    },
  },
  methods: {
    ...mapActions(["FETCH_SEARCHED_POSTS", "FETCH_MORE_SEARCHED_POSTS"]),
  },
};
</script>

<style>
</style>