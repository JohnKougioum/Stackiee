<script setup lang='ts'>
import type { PostData } from '~/types/index'

const props = defineProps<{
  item: PostData
}>()

const timeAgoOptions = useTimeAgoOptions(true)
const timeAgo = useTimeAgo(props.item.createdAt, timeAgoOptions)

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
    window.open(`http://localhost:8080/status/${props.item.id}`)

  else
    router.push(`/status/${props.item.id}`)
}
</script>

<template>
  <div
    ref="el"
    class="py-2 px-4 flex gap-4 w-full h-fit"
    tabindex="0"
    @click="onclick"
    @keydown.enter="onclick"
  >
    <div class="flex flex-col gap-1 justify-start items-center">
      <Icon name="carbon:user-avatar-filled" size="45" />
      <div class="bg-secondary-gray rounded-xl px-1 text-sm select-none">
        Student
      </div>
    </div>
    <div class="w-full">
      <div class="flex justify-between items-center">
        <span class="text-sm text-primary-gray cursor-pointer rounded-lg hover:bg-secondary-gray">
          @{{ item.User.uid }}
        </span>
        <span class="text-sm text-primary-gray">
          {{ timeAgo }}
        </span>
      </div>
      <div class="mt-1 mb-4 cursor-pointer">
        <PostCardBody :body="item.body" />
      </div>
      <div class="mt-2 h-5 flex justify-between items-center">
        <div class="flex items-center">
          <button>
            <CommonTooltip placement="bottom" content="Comments">
              <div class="btn-icon">
                <Icon name="majesticons:comment-2-line" size="20" color="#70798C" />
              </div>
            </CommonTooltip>
          </button>
          <span class="text-sm font-semibold text-primary-gray select-none">
            {{ item._count.Comment }}
          </span>
        </div>
        <button>
          <CommonTooltip placement="bottom" content="Copy Link">
            <div class="btn-icon">
              <Icon name="ph:link-simple-horizontal-duotone" size="24" color="#70798C" />
            </div>
          </CommonTooltip>
        </button>
      </div>
    </div>
  </div>
</template>
