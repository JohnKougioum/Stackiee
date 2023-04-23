<script setup lang='ts'>
const route = useRoute()
const { data } = await useFetch(`/api/posts/searchById/${route.params.id}`, {
  method: 'GET',
})
</script>

<template>
  <template v-if="data?.body">
    <PostCardBody :body="data?.body.body" />
  </template>
</template>
