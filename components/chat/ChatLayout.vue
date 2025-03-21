<script setup lang='ts'>
defineEmits<{
  (event: 'submit'): void
}>()
const modelValue = defineModel<string>()

function toggleWhiteboard() {
  isWhiteboardOpen.value = !isWhiteboardOpen.value
}
</script>

<template>
  <div class="py-4 px-0 sm:px-2 lg:px-4 h-full flex flex-col gap-4">
    <div class="rounded-2xl bg-off-white border-primary p-3 flex items-center gap-2">
      <slot name="title" />
      <div class="flex items-center gap-2">
        <CommonDropdown placement="bottom">
          <CommonTooltip placement="bottom" :content="$t('participants')">
            <img src="~/assets/UserGroupPlus.svg" class="h-8 w-8 mb-[2px] fill-primary-dark cursor-pointer">
          </CommonTooltip>
          <template #popper>
            <slot name="participantsDropdown" />
          </template>
        </CommonDropdown>
        <CommonTooltip placement="bottom" :content="$t('whiteboard')" @click="toggleWhiteboard">
          <Icon class="cursor-pointer" name="fluent:whiteboard-16-regular" size="1.8rem" />
        </CommonTooltip>
        <CommonDropdown placement="bottom">
          <CommonTooltip placement="bottom" :content="$t('settings.title')">
            <Icon class="cursor-pointer" name="iconamoon:options-duotone" size="1.8rem" />
          </CommonTooltip>
          <template #popper>
            <slot name="chat-settings" />
          </template>
        </CommonDropdown>
      </div>
    </div>
    <div class="flex-1 flex flex-col p-1 rounded-2xl bg-off-white border-primary">
      <slot name="messages" />
    </div>
    <form class="rounded-2xl py-2 bg-off-white border-primary w-full flex items-center gap-3 px-2" @submit.prevent="$emit('submit')">
      <div class="flex-1">
        <input
          v-model="modelValue"
          type="text" class="outline-none text-size-base w-full h-full bg-transparent"
          :placeholder="$t('chat.sentMessage')"
        >
      </div>
      <button type="submit">
        <Icon name="majesticons:send" size="1.5rem" class="text-base-orange cursor-pointer hover:text-base-orange-darker" />
      </button>
    </form>
  </div>
</template>
