<script setup lang='ts'>
definePageMeta({
  title: 'Login',
  layout: 'none',
})

async function loginWithCreds() {
  const { $auth } = useNuxtApp()
  const response = await $fetch('/api/login', {
    method: 'POST',
    body: {
      uid: 'it185219',
      am: '185219',
      fullName: 'APOSTOLOS MALOUDIS',
      fullNameEL: 'ΑΠΟΣΤΟΛΟΣ ΜΑΛΟΥΔΗΣ',
      email: 'ap.maloudis@gmail.com',
      eduPersonAffiliation: 'student',
      eduPersonPrimaryAffiliation: 'it',
      regyear: '2018',
    },
  })
  if (response.statusCode === 200) {
    $auth.loginCookie.value = 'true'
    await navigateTo('/')
  }
}
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
        <button class="base-button" @click="loginWithCreds">
          Tolis
        </button>
      </div>
    </div>
  </div>
</template>
