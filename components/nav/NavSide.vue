<template>
  <nav class="flex flex-col gap-2 sm:px-3 flex-shrink leading-normal md:text-xl  h-full mt-1">
    <SearchWidget class="hidden xl:flex" />
    <NavSideItem :text="$t('nav.search')" to="/search" icon="ri:search-line" class="hidden sm:block xl:hidden" />

    <div class="flex-shrink hidden sm:block mt-2" />
    <NavSideItem :text="$t('nav.home')" to="/" icon="majesticons:home-analytics-line" />
    <NavSideItem :text="$t('nav.messages')" to="/chat" icon="majesticons:messages-line" />
    <NavSideItem :text="$t('nav.profile')" :to="`/profile/${userObject?.uid}`" icon="mingcute:user-3-line" />
    <NavSideItem :text="$t('nav.announcements')" to="/announcements" icon="majesticons:megaphone-line" />
    <NavSideItem :text="$t('nav.notifications')" to="/notifications" icon="majesticons:bell-line" :class="{ 'notification-indicator': notifications.length }" />
    <NavSideItem :text="$t('nav.compose')" to="/compose" icon="quill:compose" />

    <div class="flex-shrink hidden sm:block mt-4" />
    <NavSideItem :text="$t('settings.title')" to="/settings" icon="ri:settings-3-line" />
    <NavSideItem class="block lg:hidden" element="button" :text="$t('user.signOut')" icon="ri:logout-box-line" @click.prevent="$auth.logout" />
  </nav>
</template>

<style lang="postcss" scoped>
.notification-indicator {
  position: relative;
  &::before {
    content: '';
    width: 12px;
    height: 12px;
    border-radius: 100%;
    background-color: red;
    position: absolute;
    top: 22%;
    left: 6%;
    z-index: 1;
  }
}
</style>
