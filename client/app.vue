<template>
  <NuxtLoadingIndicator color="repeating-linear-gradient(to right,#d98018 0%,#9a5420 100%)" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<!-- TODO: add font -->
<style>
html,
body,
#__nuxt {
  height: 100vh;
  margin: 0;
  padding: 0;
}

html{
  @apply bg-base text-primary-dark;
}
</style>
