<template>
  <div class="h-auto w-full mt-32">
    <div
      class="relative container center--x w-3/4 h-full flex md:flex flex-col"
    >
      <div class="flex md:flex md:justify-between">
        <div
          class="w-full h-full lg:w-4/6 post--container bg-white rounded-2xl"
        >
          <FetchJson :url="`http://localhost:5000/api/posts/${this.postId}`">
            <template v-slot="{ json: post, loading }">
              <SpinnerLoader class="relative center" v-if="loading" />
              <PostView v-else :postData="post" />
            </template>
          </FetchJson>
        </div>
        <div class="w-1/5 h-56 bg-white hidden lg:block">
          <div
            class="w-full h-full flex justify-center items-center p-4 text-center"
          >
            <h1 class="text-lg font-medium">
              Found a bug or do you want a feature?
            </h1>
          </div>
        </div>
      </div>
      <div class="w-full h-full lg:w-4/6 bg-white mt-14 p-10 rounded-2xl">
        <FetchJson :url="`http://localhost:5000/api/comments/${this.postId}`">
          <template v-slot="{ json: comments, loading }">
            <SpinnerLoader class="relative center--x" v-if="loading" />
            <Comment
              v-else
              v-for="(comment, index) in comments"
              :key="index"
              :comment="comment"
            />
          </template>
        </FetchJson>
      </div>
    </div>
  </div>
</template>

<script>
import PostView from "../components/PostView.vue";
import Comment from "../components/Comment.vue";
import FetchJson from "../components/FetchJson.vue";
import SpinnerLoader from "../components/SpinnerLoader.vue";

export default {
  name: "Post",
  components: {
    PostView,
    Comment,
    FetchJson,
    SpinnerLoader,
  },
  data() {
    return {
      postId: this.$route.params.id,
    };
  },
};
</script>

<style lang="scss">
.container {
  max-width: 1280px;
  .post--container {
    min-height: 100px;
  }
}
</style>
