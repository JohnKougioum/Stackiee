<script setup lang='ts'>

</script>

<template>
  <div class="base-chip">
    <slot />
    <!-- TODO: Add click event to delete chip -->
    <button class="flex items-center">
      <Icon name="material-symbols:cancel-outline-rounded" size="1.2rem" />
    </button>
  </div>
</template>
