<script setup lang='ts'>
async function comment() {
  console.log('comment')
}
</script>

<template>
  <div class="h-screen">
    Comment Section
    <PublishWidget :should-expand="false" @publish="comment" />
    <div class="divider" />
    <div class="my-2">
      <CommentMessage />
    </div>
  </div>
</template>
