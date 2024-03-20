<script setup lang='ts'>
definePageMeta({
  wideLayout: true,
})

const route = useRoute()

const isRootPath = computedEager(() => route.name === 'settings')
</script>

<template>
  <div class="min-h-screen flex">
    <div class="border-r-2" :class="isRootPath ? 'block lg:flex-none flex-1' : 'hidden lg:block'">
      <MainContent>
        <template #title>
          <div class="timeline-title flex items-center gap-2" @click="$scrollToTop">
            <Icon name="ri:settings-3-line" size="1.5rem" />
            <span class="text-xl font-bold">{{ $t('settings.title') }}</span>
          </div>
        </template>
        <div class="xl:w-[24.25rem] lg:w-[19.5rem]">
          <SettingsItem
            to="/settings/language"
            :match="$route.path.startsWith('/settings/language')"
            icon="majesticons:translate-line"
            :text="$t('settings.language.title')"
          />
        </div>
      </MainContent>
    </div>
    <div class="flex-1" :class="isRootPath ? 'hidden lg:block' : 'block'">
      <ClientOnly>
        <NuxtPage />
      </ClientOnly>
    </div>
  </div>
</template>
