<script setup lang='ts'>
definePageMeta({
  key: route => route.path,
  keepalive: false,
})

const route = useRoute()
console.log(route.params.account)

// const { data: account } = useAsyncData
</script>

<template>
  <MainContent back>
    <template #title>
      <div class="timeline-title flex items-center gap-2" @click="$scrollToTop">
        <Icon name="majesticons:home-analytics-line" size="1.5em" />
        {{ $t('nav.profile') }}
      </div>
    </template>
    <div
      class="profile-container p-4"
    >
      <div class="w-28 h-28 rounded-full flex items-center justify-center">
        <Icon name="carbon:user-avatar-filled" size="7rem" />
      </div>
      <div class="profile-details mt-2">
        <div class="profile-name">
          <span class="text-2xl font-bold">John Doe</span>
          <span class="text-sm text-primary-gray block">@johndoe</span>
        </div>
        details
      </div>
    </div>
  </MainContent>
</template>
