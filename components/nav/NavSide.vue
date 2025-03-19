<template>
  <nav class="flex flex-col gap-2 sm:px-3 flex-shrink leading-normal md:text-xl  h-full mt-1">
    <NavSideItem :text="$t('nav.search')" to="/search" icon="ri:search-line" class="hidden sm:block xl:hidden" />

    <div class="flex-shrink hidden sm:block mt-2" />
    <NavSideItem :text="$t('nav.home')" to="/" icon="majesticons:home-analytics-line" />
    <NavSideItem :text="$t('nav.messages')" to="/chat" icon="majesticons:messages-line" />
    <NavSideItem :text="$t('nav.profile')" :to="`/profile/${userObject?.uid}`" icon="mingcute:user-3-line" />
    <NavSideItem :text="$t('nav.announcements')" to="/announcements" icon="majesticons:megaphone-line" />
    <NavSideItem :text="$t('nav.compose')" to="/compose" icon="quill:compose" />

    <div class="flex-shrink hidden sm:block mt-4" />
    <NavSideItem :text="$t('settings.title')" to="/settings" icon="ri:settings-3-line" />
  </nav>
</template>
