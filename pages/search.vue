<script setup lang='ts'>
const route = useRoute()
</script>

<template>
  <!-- You searched for {{ route.query.query }} -->
  <TimelinePaginator :search-query="route.query.query as string" />
</template>
