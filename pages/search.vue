<script setup lang='ts'>
const route = useRoute()
const search = $ref<{ inputRef?: HTMLInputElement }>()

watchEffect(() => {
  if (isMediumOrLargeScreen && route.name === 'explore' && search?.inputRef)
    search?.inputRef?.focus()
})
onActivated(() => {
  search?.inputRef?.focus()
})
onDeactivated(() => search?.inputRef?.blur())
</script>

<template>
  <MainContent back>
    <template v-if="!isExtraLargeScreen" #title>
      <span to="/search" class="timeline-title flex items-center gap-2" @click="$scrollToTop">
        <Icon name="ri:search-line" size="1.5em" />
        {{ $t('pagesTitles.search') }}
      </span>
    </template>
    <template v-else #title>
      <SearchWidget v-if="isHydrated" ref="search" class="m-1" />
    </template>
    <div class="p-4">
      <span class="text-lg">
        {{ $t('searchedFor') }}
        <b class="italic">
          {{ route.query.query }}
        </b>
      </span>
    </div>
    <TimelinePaginator :search-query="route.query.query as string" />
  </MainContent>
</template>
