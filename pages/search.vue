<script setup lang='ts'>
const route = useRoute()
</script>

<template>
  <!-- You searched for {{ route.query.query }} -->
  <MainContent>
    <template #title>
      <NuxtLink to="/search" class="timeline-title flex items-center gap-2" @click="$scrollToTop">
        <Icon name="ri:search-line" size="1.5em" />
        {{ $t('pagesTitles.search') }}
      </NuxtLink>
    </template>

    <TimelinePaginator :search-query="route.query.query as string" />
  </MainContent>
</template>
