<script setup lang='ts'>
const route = useRoute()
const { data } = await useFetch(`/api/posts/searchById/${route.params.id}`, {
  method: 'GET',
})
</script>

<template>
  <MainContent back>
    <div class="mt-4">
      <template v-if="data?.body">
        <StatusDetails
          class="px-0"
          :user="data.body.User!"
          :time-ago="data.body.createdAt!"
          inline
        >
          <ContentRenderer :body="data?.body.body" />
        </StatusDetails>
        <CommentSection :id="data?.body?.id" class="mt-2" />
      </template>
    </div>
  </MainContent>
</template>
