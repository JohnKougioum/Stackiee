<script setup lang='ts'>
async function comment() {
  console.log('comment')
}
</script>

<template>
  <div class="border-t-2">
    <PublishWidget
      class="pb-12 pt-4"
      :should-expand="false"
      :button-text="$t('reply')"
      @publish="comment"
    />
    <div class="divider" />
    <div class="my-2">
      <CommentMessage />
    </div>
  </div>
</template>
