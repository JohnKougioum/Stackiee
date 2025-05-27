<script setup lang="ts">
const props = withDefaults(defineProps<{
  element?: string
  text?: string
  icon: string
  to: string | Record<string, string>
  userOnly?: boolean
}>(), {
  element: 'NuxtLink',
  userOnly: false,
})

defineSlots<{
  icon: object
  default: object
}>()

const componentToDisplay = computed(() =>
  props.element === 'NuxtLink' ? resolveComponent('NuxtLink') : props.element,
)

const activeClass = ref('text-primary-dark')
onHydrated(async () => {
  activeClass.value = ''
  await nextTick()

  activeClass.value = 'text-base-orange'
})

// Optimize rendering for the common case of being logged in, only show visual feedback for disabled user-only items
// when we know there is no user.
const noUserDisable = computed(() => !isHydrated.value || props.userOnly)
const noUserVisual = computed(() => isHydrated.value && props.userOnly)
</script>

<template>
  <component
    :is="componentToDisplay"
    :to="to"
    :disabled="noUserDisable"
    :class="noUserVisual ? 'opacity-25 pointer-events-none ' : ''"
    :active-class="activeClass"
    class="group focus:outline-none disabled:pointer-events-none"
    :tabindex="noUserDisable ? -1 : null"
    @click="$scrollToTop"
  >
    <CommonTooltip :disabled="!isMediumOrLargeScreen" :content="text" placement="right">
      <div
        class="flex items-center gap-4 w-fit rounded-xl px-2 py-2 mx-3 sm:mx-auto xl:ml-0 xl:mr-5 xl:px-5 xl:w-auto
        duration-100 group-hover:bg-secondary-gray group-focus-visible:ring-2 group-focus-visible:ring-primary-gray"
      >
        <slot name="icon">
          <Icon :name="icon" size="1.5rem" />
        </slot>
        <slot>
          <span class="block sm:hidden xl:block select-none">{{ isHydrated ? text : '&nbsp;' }}</span>
        </slot>
      </div>
    </CommonTooltip>
  </component>
</template>
