<script setup lang='ts'>
useHead({
  title: 'Notifications',
})
</script>

<template>
  <MainContent back>
    <template #title>
      <div class="timeline-title flex items-center gap-2" @click="$scrollToTop">
        <Icon name="majesticons:bell-line" size="1.5em" />
        {{ $t('nav.notifications') }}
      </div>
    </template>
    <CommonLoader v-if="notificationsLoading" class="mt-24" />
    <div v-else class="mt-4 px-2 md:px-0">
      <NotificationItem v-for="notification in notifications" :key="notification.id" class="mt-4" :notification="notification" />
    </div>
  </MainContent>
</template>
