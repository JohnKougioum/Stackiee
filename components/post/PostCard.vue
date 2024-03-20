<script setup lang='ts'>
import type { PostData } from '~/types/index'

const props = defineProps<{
  item: PostData
}>()

const timeAgoOptions = useTimeAgoOptions(true)
const timeAgo = computed(() => useTimeAgo(props.item.createdAt, timeAgoOptions))

const el = ref<HTMLElement>()
const router = useRouter()

function onclick(evt: MouseEvent | KeyboardEvent) {
  const path = evt.composedPath() as HTMLElement[]
  const el = path.find(el => ['A', 'BUTTON', 'IMG', 'VIDEO'].includes(el.tagName?.toUpperCase()))
  const text = window.getSelection()?.toString()
  if (!el && !text)
    go(evt)
}

function go(evt: MouseEvent | KeyboardEvent) {
  if (evt.metaKey || evt.ctrlKey)
    window.open(`${window.location.origin}/status/${props.item.id}`)

  else
    router.push(`/status/${props.item.id}`)
}
</script>

<template>
  <StatusHeader
    ref="el"
    tabindex="0"
    :user="item.User"
    :time-ago="unref(timeAgo)"
    @click="onclick"
    @keydown.enter="onclick"
  >
    <div class="mt-1 mb-4 cursor-pointer">
      <ContentRenderer :body="item.body" />
    </div>
    <div class="mt-2 h-5 flex justify-between items-center">
      <div class="flex items-center">
        <button class="btn-icon">
          <CommonTooltip placement="bottom" :content="$t('comments')">
            <div class="btn-icon">
              <Icon name="majesticons:comment-2-line" size="20" color="#70798C" />
            </div>
          </CommonTooltip>
        </button>
        <span class="text-sm font-semibold text-primary-gray select-none">
          {{ item._count.Comment }}
        </span>
      </div>
      <button class="btn-icon">
        <CommonTooltip placement="bottom" :content="$t('copyLink')">
          <div class="btn-icon">
            <Icon name="ph:link-simple-horizontal-duotone" size="24" color="#70798C" />
          </div>
        </CommonTooltip>
      </button>
    </div>
  </StatusHeader>
</template>
