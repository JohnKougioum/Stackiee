<script setup>
</script>

<template>
  <div v-if="isHydrated" class="py-8 px-10 lg:flex flex-col gap-2 hidden">
    <button class="bg-base-orange py-2 rounded-3xl text-xl text-white hover:bg-base-orange-darker" @click="$auth.redirectToLogin">
      {{ $t('user.signIn') }}
    </button>
  </div>
</template>
