<script lang="ts" setup>
let { modelValue } = $defineModel<{
  modelValue: boolean
}>()

function toggleVisible() {
  modelValue = !modelValue
}

const buttonEl = ref<HTMLDivElement>()
/** Close the drop-down menu if the mouse click is not on the drop-down menu button when the drop-down menu is opened */
function clickEvent(mouse: MouseEvent) {
  if (mouse.target && !buttonEl.value?.children[0].contains(mouse.target as any)) {
    if (modelValue) {
      document.removeEventListener('click', clickEvent)
      modelValue = false
    }
  }
}

watch($$(modelValue), (val) => {
  if (val && typeof document !== 'undefined')
    document.addEventListener('click', clickEvent)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', clickEvent)
})
</script>

<template>
  <div ref="buttonEl" class="flex items-center static">
    <slot :toggle-visible="toggleVisible" :show="modelValue" />

    <!-- Drawer -->
    <Transition
      enter-active-class="transition duration-250 ease-out children:transition children:duration-250 children:ease-out"
      enter-from-class="opacity-0 children:transform children:translate-y-full"
      enter-to-class="opacity-100 children:transform children:translate-y-0"
      leave-active-class="transition duration-250 ease-in  children:transition children:duration-250 children:ease-in"
      leave-from-class="opacity-100 children:transform children:translate-y-0"
      leave-to-class="opacity-0 children:transform children:translate-y-full"
    >
      <div
        v-show="modelValue"
        class="absolute inset-x-0 top-auto bottom-full z-20 h-[100vh] flex items-end
        overflow-y-scroll overflow-x-hidden scrollbar-hide overscroll-none bg-base bg-opacity-50"
      >
        <!-- The style `scrollbar-hide overscroll-none overflow-y-scroll mb="-1px"` and `h="[calc(100%+0.5px)]"` is used to implement scroll locking, -->
        <!-- corresponding to issue: #106, so please don't remove it. -->
        <div class="absolute inset-0 opacity-0 h-[calc(100vh+0.5px)]" />
        <div
          class="flex-1 min-w-[12rem] py-6 mb-[-1px] overflow-y-auto scrollbar-hide overscroll-none
        max-h-[calc(100vh-200px)] rounded-t-lg bg-white bg-opacity-75
        backdrop-filter backdrop-blur-md border-t-[1px] border-base"
        >
          <!-- Nav -->
          <NavSide />
        </div>
      </div>
    </Transition>
  </div>
</template>
