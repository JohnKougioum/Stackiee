<script setup lang='ts'>

</script>

<template>
  <div class="min-h-screen flex justify-center items-center">
    <div class="text-center flex flex-col gap-2 items-start">
      <h1>{{ $t('chat.select_a_chat') }}</h1>
      <span>{{ $t('chat.or_create_a_new_one') }}</span>
      <NuxtLink class="base-button mt-2 text-lg" to="/chat/create">
        {{ $t('chat.new_chat') }}
      </NuxtLink>
    </div>
  </div>
</template>
