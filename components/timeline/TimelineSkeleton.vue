<script setup lang="ts">
defineProps<{
  hideUserIcon?: boolean
}>()
</script>

<template>
  <div>
    <StatusCardSkeleton :hide-user-icon="hideUserIcon" class="opacity-50" />
    <StatusCardSkeleton :hide-user-icon="hideUserIcon" class="opacity-30" />
    <StatusCardSkeleton :hide-user-icon="hideUserIcon" class="opacity-20" />
    <StatusCardSkeleton :hide-user-icon="hideUserIcon" class="opacity-10" />
  </div>
</template>
