<template>
  <div class="st-container flex md:flex md:justify-center">
    <div class="flex w-full lg:w-1/2 justify-center items-center">
      <div class="custom-width">
        <PostsArea :posts="getPosts" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import PostsArea from "../component/PostsArea.vue";
export default {
  name: "Home",
  components: {
    PostsArea,
  },
  mounted() {
    this.FETCH_POSTS();
    //TODO add this to a mixin
    document.addEventListener("scroll", (e) => {
      if (
        document.documentElement.scrollTop + window.innerHeight ===
        document.documentElement.offsetHeight
      ) {
        this.FETCH_POSTS();
      }
    });
  },
  computed: {
    ...mapGetters(["getPosts"]),
  },
  methods: {
    ...mapActions(["FETCH_POSTS"]),
  },
};
</script>

<style>
.custom-width {
  width: 640px;
}
</style>
