<script setup lang="ts">
// @ts-expect-error missing types
import { DynamicScrollerItem } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { PostData } from '~/types/index'

interface PostsResults {
  next?: {
    page: number
    limit: number
  }
  previous?: {
    page: number
    limit: number
  }
  posts: PostData[]
}

const posts = ref<PostData[]>([])
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
</script>

<template>
  <div class="xl:block h-6" />
  <div>
    <template v-if="isHydrated && posts">
      <CommonPaginator v-model:page="page" :items="posts" :pending="pending" :next-page="nextPage">
        <template #default="{ item, active, index }">
          <DynamicScrollerItem
            :item="item"
            :active="active"
            :size-dependencies="[
              item.body,
            ]"
            :data-index="index"
          >
            <div class="pb-3 pt-5 border-b-2">
              <PostCard :item="item as PostData" />
              <!-- <div class="flex justify-between">
                <span class="text-lg">
                  {{ item.user }}
                </span>
                <span class="text-sm">
                  {{ item.createdAt }}
                </span>
              </div>
              <h1>
                {{ item.title }}
              </h1>
              <p class="text-xl pt-4 pb-1">
                {{ item.body }}
              </p> -->
            </div>
          </DynamicScrollerItem>
        </template>
      </CommonPaginator>
    </template>
  </div>
</template>
