<script setup lang='ts'>
definePageMeta({
  title: 'Login',
  layout: 'none',
})
</script>

<template>
  <div class="flex h-full">
    <div class="flex-1 bg-base-orange" />
    <div class="max-w-[450px] px-20 py-32 flex flex-col justify-between">
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio sapiente nam quis mollitia aut, nemo culpa obcaecati quae quaerat consectetur impedit modi harum ipsam tenetur sequi. Quidem quam inventore sunt!
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio sapiente nam quis mollitia aut, nemo culpa obcaecati quae quaerat consectetur impedit modi harum ipsam tenetur sequi. Quidem quam inventore sunt!
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio sapiente nam quis mollitia aut, nemo culpa obcaecati quae quaerat consectetur impedit modi harum ipsam tenetur sequi. Quidem quam inventore sunt!
      </p>

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
