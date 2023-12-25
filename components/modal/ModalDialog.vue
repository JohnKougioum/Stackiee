<script setup lang='ts'>
export interface Props {
  useVIf?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  useVIf: true,
})

const emit = defineEmits<{
  (e: 'close'): void
}>()
const deactivated = useDeactivated()

const route = useRoute()
const routePath = ref(route.path)
const visible = defineModel<boolean>({ required: true })

watch(visible, (value) => {
  if (value)
    routePath.value = route.path
})

const notInCurrentPage = computed(() => deactivated.value || routePath.value !== route.path)
watch(notInCurrentPage, (value) => {
  if (value)
    close()
})

const isVIf = computed(() => {
  return props.useVIf
    ? visible.value
    : true
})

const isVShow = computed(() => {
  return !props.useVIf
    ? visible.value
    : true
})

function close() {
  if (!visible.value)
    return
  visible.value = false
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="dialog-visible">
      <div
        v-if="isVIf"
        v-show="isVShow"
        aria-modal="true"
        class="fixed inset-0 overflow-y-auto scrollbar-hide overscroll-none z-50"
      >
        <div class="dialog-mask absolute inset-0 z-0 bg-transparent opacity-100 backdrop-filter backdrop-blur-sm touch-none" />
        <div class="dialog-mask absolute inset-0 z-0 bg-black bg-opacity-50 touch-none h-[calc(100%+0.5px)]" @click="close" />
        <div class="absolute inset-0 z-10 pointer-events-none opacity-100 flex">
          <div class="flex-1 flex items-center justify-center p-4">
            <div
              class="dialog-main rounded-md pointer-events-auto shadow-lg isolate bg-base border-[1px] border-secondary-gray max-h-full
                 overscroll-contain touch-pan-y touch-pan-x overflow-y-auto overflow-x-hidden"
              v-bind="$attrs"
            >
              <slot />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="postcss" scoped>
.dialog-visible-enter-active,
.dialog-visible-leave-active {
  transition-duration: 0.25s;

  .dialog-mask {
    transition: opacity 0.25s ease;
  }

  .dialog-main {
    transition: opacity 0.25s ease, transform 0.25s ease;
  }
}

.dialog-visible-enter-from,
.dialog-visible-leave-to {
  .dialog-mask {
    opacity: 0;
  }

  .dialog-main {
    transform: translateY(50px);
    opacity: 0;
  }
}
</style>
