<template>
  <nav class="flex flex-col gap-2 sm:px-3 flex-shrink leading-normal md:text-lg h-full mt-1">
    <!-- <SearchWidget class="custom-inline-margin lg:ms-1 lg:me-5 hidden xl:block" /> -->
    <NavSideItem text="Search" to="/explore" icon="ri:search-line" class="hidden sm:block xl:hidden" />

    <div class="flex-shrink hidden sm:block mt-2" />
    <NavSideItem text="Home" to="/home" icon="majesticons:home-analytics-line" />
    <NavSideItem text="Messages" to="/chat" icon="majesticons:messages-line" />
    <NavSideItem text="Profile" to="/profile" icon="mingcute:user-3-line" />
    <NavSideItem text="Dashboard" to="/dashboard" icon="majesticons:dashboard-line" />
    <NavSideItem text="Compose" to="/compose" icon="quill:compose" color="#E29578" />

    <div class="flex-shrink hidden sm:block mt-4" />
    <NavSideItem text="Settings" to="/settings" icon="ri:settings-3-line" />
  </nav>
</template>

<style lang="scss" scoped>
@media screen and (min-width: 1024px) {
    .custom-inline-margin {
        margin-inline-start: 0.25rem;
        margin-inline-end: 1.25rem;
    }
}
</style>
