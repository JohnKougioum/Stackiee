<script setup lang='ts'>
import type { ApiResult, CommentData } from '~/types'

const props = defineProps<{
  id: string
}>()

const { data: comments, pending, refresh } = await useFetch(`/api/comments/${props.id}`, {
  method: 'GET',
  server: false,
})

const errorMessage = ref('')
async function addComment(comment: string) {
  const { data, error } = await useFetch('/api/comments/create', {
    method: 'POST',
    body: {
      postId: props.id,
      comment,
    },
  })
  const { $auth } = useNuxtApp()
  if (error.value?.statusCode === 401)
    $auth.redirectToLogin()

  if (data.value?.statusCode !== 200)
    errorMessage.value = 'Something went wrong! Please try again later.'
  else
    refresh()
}

async function scrollIntoView(id: string) {
  const queryCommentId = useRoute().query.comment || ''
  if (!queryCommentId || queryCommentId !== id)
    return
  await nextTick()
  const element = document.getElementById(`comment-${queryCommentId}`)
  if (element) {
    setTimeout(() => {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }, 100)
  }
  useRouter().replace({ query: { ...useRoute().query, comment: undefined } })
}

onReactivated(() => {
  refresh()
})
</script>

<template>
  <div class="border-t-2">
    <template v-if="errorMessage">
      <div class="text-center text-red-500">
        {{ errorMessage }}
      </div>
    </template>
    <PublishWidget
      class="px-2 sm:px-0 pb-12 pt-4"
      :should-expand="false"
      :button-text="$t('reply')"
      @publish="addComment"
    />
    <ClientOnly>
      <div class="divider" />
    </ClientOnly>
    <div class="my-2 py-2">
      <TimelineSkeleton v-if="pending" />
      <template v-if="comments && !pending">
        <CommentMessage
          v-for="comment in (comments as ApiResult<CommentData[]>).body"
          :id="`comment-${comment.id}`"
          :key="comment.id"
          class="border-b-2 py-4"
          :data="comment"
          @vue:mounted="scrollIntoView(comment.id)"
        />
      </template>
    </div>
  </div>
</template>
