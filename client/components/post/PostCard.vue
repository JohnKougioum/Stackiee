<script setup lang='ts'>
import type { PostData } from '~/types/index'

const props = defineProps<{
  item: PostData
}>()

const createdAt = useFormattedDateTime(props.item.createdAt)
</script>

<template>
  <article>
    <div class="py-2 px-4 flex gap-4 w-full h-fit" tabindex="0">
      <div class="flex flex-col gap-1 justify-start items-center">
        <Icon name="carbon:user-avatar-filled" size="45" />
        <div class="bg-secondary-gray rounded-xl px-1 text-sm select-none">
          Student
        </div>
      </div>
      <div class="w-full">
        <div class="flex justify-between items-center">
          <span class="text-sm text-primary-gray cursor-pointer rounded-lg hover:bg-secondary-gray">
            @{{ item.user }}
          </span>
          <span class="text-sm text-primary-gray">
            {{ createdAt }}
          </span>
        </div>
        <div class="my-2 cursor-pointer">
          {{ item.body }}
        </div>
        <div class="mt-2 h-5 flex justify-between items-center">
          <div class="flex items-center">
            <button>
              <CommonTooltip placement="bottom" content="Comments">
                <div class="p-2 leading-[0] rounded-full hover:bg-secondary-gray duration-100">
                  <Icon name="majesticons:comment-2-line" size="20" color="#70798C" />
                </div>
              </CommonTooltip>
            </button>
            <span class="text-sm font-semibold text-primary-gray select-none">
              {{ item.comments }}
            </span>
          </div>
          <button>
            <CommonTooltip placement="bottom" content="Copy Link">
              <div class="p-2 leading-[0] rounded-full hover:bg-secondary-gray duration-100">
                <Icon name="ph:link-simple-horizontal-duotone" size="24" color="#70798C" />
              </div>
            </CommonTooltip>
          </button>
        </div>
      </div>
    </div>
  </article>
</template>
