<script setup lang="ts">
// @ts-expect-error missing types
import { DynamicScrollerItem } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import type { PostData } from '~/types/index'

const posts = ref<PostData[]>([])
const page = ref(1)
const nextPage = ref(true)
const { pending, error, execute } = await useFetch('/api/posts/search', {
  method: 'POST',
  body: {
    page,
  },
  server: false,
  watch: [page],
  onResponse({ response }) {
    posts.value.push(...response._data.body)
    nextPage.value = posts.value.length < response._data.postsCount
  },
})

onActivated(() => {
  page.value = 1
  posts.value = []
  execute()
})
</script>

<template>
  <div class="xl:block h-6" />
  <div>
    <MainContent>
      <CommentSection />
    </MainContent>
    <!-- <template v-if="isHydrated && posts">
      <CommonPaginator v-model:page="page" :items="posts" :pending="pending" :next-page="nextPage">
        <template #default="{ item, active, index }">
          <DynamicScrollerItem
            :item="item"
            :active="active"
            :size-dependencies="[
              item.body,
            ]"
            :data-index="index"
            tag="article"
          >
            <div class="pb-3 pt-5 border-b-2">
              <PostCard :item="item as PostData" />
            </div>
          </DynamicScrollerItem>
        </template>
      </CommonPaginator>
    </template> -->
  </div>
</template>
