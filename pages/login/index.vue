<script setup lang='ts'>
definePageMeta({
  title: 'Login',
  layout: 'none',
})

const codeSnippets = [
  // eslint-disable-next-line no-template-curly-in-string
  'const greet = name => `Hello, ${name}`;',
  'function add(a, b) { return a + b; }',
  'let items = [1,2,3].map(x => x * 2);',
  'if (user.isAdmin) { showDashboard(); }',
  'await fetch("/api/data").then(res => res.json());',
  'class Person { constructor(n){this.name=n;} }',
  'const PI = 3.14159;',
  'for(let i=0;i<10;i++){ console.log(i); }',
  'try { riskyOp(); } catch(e) { console.error(e); }',
  'import React from "react";',
]
</script>

<template>
  <div class="box-content h-full w-full relative">
    <div id="codeSnippets" class="h-full w-full code-lines">
      <template v-for="i in 70" :key="i">
        <span
          class="code-line" :style="{
            top: `${i * 2}%`,
            left: `${Math.random() * 90}%`,
            animationDelay: `${Math.random() * 8}s`,
          }"
        >
          {{ codeSnippets[Math.floor(Math.random() * codeSnippets.length)] }}
        </span>
      </template>
    </div>
    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 py-6 px-8 bg-base rounded-lg shadow-xl border-primary w-[340px] md:w-[420px]">
      <div class="flex justify-center mb-2">
        <img class="block" src="../../assets/logo_full.svg" alt="logo">
      </div>
      <div class="text-center py-2">
        <p>
          Η εφαρμογή Stackiee προσφέρει έναν σύγχρονο, οργανωμένο χώρο για φοιτητική επικοινωνία και αλληλεπίδραση. Οι χρήστες μπορούν να δημοσιεύουν απορίες, να ανταλλάσσουν μηνύματα και να ενημερώνονται για τις εξελίξεις του τμήματος.
          <br>
          <br>
          Αναπτύχθηκε στο πλαίσιο διπλωματικής εργασίας
        </p><div class="flex justify-between pt-2">
          <span class="font-bold">
            Μαλούδης Απόστολος
          </span>
          <span class="font-bold">
            Κουγιουμτζίδης Ιωάννης
          </span>
        </div>
      </div>
      <button
        class="bg-base-orange w-full py-2 rounded-lg text-xl text-white hover:bg-base-orange-darker mt-4"
        @click="$auth.redirectToLogin"
      >
        {{ $t('user.signIn') }}
      </button>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.code-lines {
  position:absolute;
  top:0;
  left:0;
  width:100%;
  height:100%;
  font-size:1rem;
  font-family:monospace;
  color:rgba(255,255,255,0.06);
  overflow:hidden;
  background: #2F363F;
}

.code-line {
  position:absolute;
  white-space:nowrap;
  animation:scrollUp 8s linear infinite;
  user-select: none;
}
@keyframes scrollUp {
  from { transform: translateY(100%); }
  to   { transform: translateY(-100%); }
}
</style>
