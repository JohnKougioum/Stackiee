<template>
  <MainContent>
    <SearchFiltersWidget />
    <template #title>
      <NuxtLink to="/" class="timeline-title flex items-center gap-2" @click="$scrollToTop">
        <Icon name="majesticons:home-analytics-line" size="1.5em" />
        {{ $t('pagesTitles.home') }}
      </NuxtLink>
    </template>
    <TimelinePaginator />
  </MainContent>
</template>
