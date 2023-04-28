<script setup lang='ts'>
import type { CommentData } from '~/types/index'
const props = defineProps<{
  data: CommentData
}>()

const timeAgoOptions = useTimeAgoOptions(true)
const timeAgo = useTimeAgo(props.data.createdAt, timeAgoOptions)
</script>

<template>
  <StatusHeader :user="data.User" :time-ago="timeAgo">
    <ContentRenderer :body="data.body" />
  </StatusHeader>
</template>
