<script setup lang='ts'>
const props = defineProps<{
  accountId: string
}>()

const tabs = [
  { name: 'Posts', api: '/api/user/posts', hideUserIcon: false, minItemSize: 130 },
  { name: 'Comments', api: '/api/user/comments', hideUserIcon: true, minItemSize: 150 },
]
const selectedTabIndex = ref(0)

const items = ref([])
const page = ref(1)
const nextPage = ref(true)

const { status, error } = await useAsyncData(`tab-${selectedTabIndex.value}`, () => {
  return $fetch(tabs[selectedTabIndex.value].api, {
    method: 'POST',
    body: {
      page: page.value,
      id: props.accountId,
    },
  }).then((response) => {
    const { statusCode, body, postsCount, commentsCount } = response as { statusCode: number; postsCount?: number; commentsCount?: number; body: object[] }
    if (statusCode === 204 || postsCount === 0 || commentsCount === 0) {
      nextPage.value = false
      return
    }
    items.value.push(...body as never[])
    nextPage.value = items.value.length < (postsCount || commentsCount || 0)
  }).catch((error) => {
    console.error(error)
  })
}, {
  immediate: true,
  watch: [selectedTabIndex, page],
})

const pending = computed(() => status.value === 'pending')

watch(selectedTabIndex, () => {
  page.value = 1
  items.value = []
})
</script>

<template>
  <div>
    <div class="w-full flex justify-evenly items-center">
      <button
        v-for="(tab, index) in tabs"
        :key="tab.name"
        class="w-full p-2 border-b-2 text-lg hover:bg-zinc-200 transition duration-75"
        :class="{ 'border-base-orange': selectedTabIndex === index }"
        @click="selectedTabIndex = index"
      >
        {{ $t(tab.name.toLocaleLowerCase()) }}
      </button>
    </div>
    <div>
      <template v-if="isHydrated">
        <template v-if="tabs[selectedTabIndex].name === 'Posts'">
          <div v-for="item in items" :key="item.id" class="py-2 border-b-2">
            <PostCard class="!px-0 md:!px-4 borber-" :item="item" />
          </div>
        </template>
        <template v-else>
          <div v-for="item in items" :key="item.id" class="flex flex-col items-center justify-between py-2 border-b-2">
            <NuxtLink :to="`/status/${item.postId}?comment=${item.id}`" class="text-sm text-sky-700 italic">
              {{ $t('replyTo') }}
              <span class="capitalize">

                {{ displayUsernameLocale(item?.postUsername?.fullName, item?.postUsername?.fullNameEL, true) }}
              </span>
            </NuxtLink>
            <div class="flex flex-col gap-1 mt-1">
              <div class="h-[.125rem] w-[1px] border-slate-600 border-[1px]" />
              <div class="h-[.125rem] w-[1px] border-slate-600 border-[1px]" />
              <div class="h-[.125rem] w-[1px] border-slate-600 border-[1px] " />
              <div class="h-2 w-[1px] border-slate-600 border-[1px]" />
            </div>
            <CommentMessage class="pt-1" :data="item" />
          </div>
        </template>

        <template v-if="status !== 'pending' && error">
          <div class="text-center p-4 mt-10 text-xl">
            {{ $t('somethingWentWrong') }}
          </div>
        </template>
      </template>
    </div>
  </div>
</template>
