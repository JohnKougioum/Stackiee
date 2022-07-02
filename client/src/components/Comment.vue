<template>
  <div class="flex flex-col px-6 py-4">
    <div class="flex flex-row justify-between">
      <h1 class="text-blue-600">{{ comment.user }}</h1>
      <div class="text-sm">
        <i>{{ comment.createdAt }}</i>
      </div>
    </div>
    <div class="py-6 pl-4">
      <p>{{ comment.body }}</p>
    </div>
    <hr class="custom--hr" />
  </div>
</template>

<script>
export default {
  name: "Comment",
  props: {
    comment: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style>
.custom--hr {
  border-top: 1px solid rgba(0, 0, 0, 0.334);
}
</style>
