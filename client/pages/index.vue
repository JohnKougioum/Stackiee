<script setup lang="ts">
// @ts-expect-error missing types
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

interface Post {
  _id: string
  user: string
  title: string
  body: string
  semester: string
  course: string
  createdAt: Date
  __v: number
  comments: number
}
interface PostsResults {
  next?: {
    page: number
    limit: number
  }
  previous?: {
    page: number
    limit: number
  }
  posts: Post[]
}

const posts = ref<Post[]>([])
const page = ref(1)
const nextPage = ref(true)
const { pending, error } = await useFetch<PostsResults>('/devApi/posts', {
  query: {
    page,
  },
  server: false,
  watch: [page],
  onResponse({ response }) {
    posts.value.push(...response._data.posts)
    nextPage.value = Object.keys(response._data).includes('next')
  },
})
const { endAnchor } = usePaginator(page, pending, nextPage)
// TODO: skeleton loading, extract login to component
</script>

<template>
  <div class="xl:block h-6" />
  <div class="text-3xl">
    <div v-if="pending">
      Loading...
    </div>

    <template v-if="isHydrated && posts">
      <TestComponent :items="posts">
        <template #anchor>
          <div ref="endAnchor" />
        </template>
      </TestComponent>
    </template>
  </div>
</template>
