<template>
  <div class="py-8 px-10 lg:flex flex-col gap-2 hidden">
    <button class="bg-base-orange py-2 rounded-3xl text-xl text-white hover:bg-base-orange-darker" @click="redirectToLogin">
      {{ $t('user.signIn') }}
    </button>
  </div>
</template>
