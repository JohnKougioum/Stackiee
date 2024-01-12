<script setup lang="ts">
// @ts-expect-error missing types
import { DynamicScrollerItem } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { storeToRefs } from 'pinia'
import type { PostData } from '~/types/index'

const props = defineProps<{
  searchQuery?: string
}>()

const reactiveProp = toRefs(props)
const { filters } = storeToRefs(useFilters())

let searchQueryHistory = props.searchQuery
const filtersHistory = [...filters.value]
const selectedSemesters = computed(() => filters.value.filter(item => item.length === 1))
const selectedCourses = computed(() => filters.value.filter(item => item.length === 4))

const posts = ref<PostData[]>([])
const page = ref(1)
const nextPage = ref(true)

const { pending, error, execute } = await useFetch('/api/posts/search', {
  method: 'POST',
  body: {
    page,
    searchQuery: reactiveProp.searchQuery,
    semesters: selectedSemesters || [],
    courses: selectedCourses || [],
  },
  server: false,
  watch: [page, filters],
  onRequest() {
    if (
      searchQueryHistory !== reactiveProp.searchQuery?.value
      || !areArraysEqual(filtersHistory, filters.value)
    ) {
      page.value = 1
      posts.value = []
      searchQueryHistory = reactiveProp.searchQuery?.value
      filtersHistory.splice(0, filtersHistory.length, ...filters.value)
    }
  },
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

function areArraysEqual(arr1: string[], arr2: string[]) {
  if (arr1.length !== arr2.length)
    return false

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i])
      return false
  }
  return true
}
</script>

<template>
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
            tag="article"
          >
            <div class="pb-3 pt-5 border-b-2">
              <PostCard :item="item as PostData" />
            </div>
          </DynamicScrollerItem>
        </template>
      </CommonPaginator>
    </template>
  </div>
</template>
