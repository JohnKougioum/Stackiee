<script setup lang='ts'>
definePageMeta({
  title: 'Login',
  layout: 'none',
})
</script>

<template>
  <div class="flex h-full">
    <div class="flex-1 bg-red-500" />
    <div class="min-w-[500px] px-20 py-40 flex flex-col justify-between">
      <p>bla bla bla</p>
      <p>this is a thesis bla bla bla</p>

      <div class="py-8 px-10">
        <button
          class="bg-base-orange w-full py-2 rounded-lg text-xl text-white hover:bg-base-orange-darker"
          @click="$auth.redirectToLogin"
        >
          {{ $t('user.signIn') }}
        </button>
      </div>
    </div>
  </div>
</template>
