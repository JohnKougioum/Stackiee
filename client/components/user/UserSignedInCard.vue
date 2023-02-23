<script setup lang='ts'>
</script>

<template>
  <div class="px-2 pt-8 lg:flex flex-col hidden">
    <div
      class="flex items-center justify-between gap-1 bg-base-orange bg-opacity-20 rounded-3xl
        cursor-pointer hover:bg-opacity-40 duration-75"
    >
      <div class="flex gap-2">
        <Icon name="carbon:user-avatar-filled" size="3rem" />
        <div class="text-sm flex-1 flex flex-col">
          <span class="w-[10rem] text-ellipsis whitespace-nowrap overflow-hidden">
            Κουγιουμτζίδης Ιωάννης
          </span>
          <span class="text-primary-gray">@it185201</span>
        </div>
      </div>
      <Icon name="majesticons:more-menu-vertical" size="2.3rem" />
    </div>
  </div>
</template>
