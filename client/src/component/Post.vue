<template>
  <div
    class="
      md:w-full
      flex flex-col
      bg-white
      rounded-2xl
      shadow-lg
      p-2
      cursor-pointer
    "
  >
    <div class="flex flex-row p-3">
      <div class="pl-2 pr-2 md:pr-4 flex">
        <img src="../assets/images/UserIcon.svg" alt="HTML5" />
      </div>
      <div class="flex flex-col">
        <div>
          <h1 class="text-sm text-gray-600">
            Δημοσιευτηκε απο <span class="text-blue-600">it185201</span> στις
            20/4/2020
          </h1>
        </div>
        <div>
          <span class="text-xs bg-gray-300 rounded p-0.5">Student</span>
        </div>
      </div>
    </div>
    <div class="px-7 md:pl-20 md:pr-14 md:text-2xl">
      <h1>Δήλωση μαθημάτων</h1>
    </div>
    <div class="break-line py-1 flex justify-center">
      <div class="h-0.5 border bg-gray-300 rounded w-5/6"></div>
    </div>
    <div class="flex flex-col px-7 md:pl-20 md:pr-14">
      <div>
        <p class="md:text-lg">
          thelo na dilwso mathimata alla den me afinei to system asdas
        </p>
      </div>
      <div class="pt-6 pb-2">
        <div class="flex flex-row">
          <img src="../assets/images/commentIcon.svg" alt="HTML5" />
          <span class="pl-2 text-sm italic">5 σχολια</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Post",
};
</script>

<style>
</style>