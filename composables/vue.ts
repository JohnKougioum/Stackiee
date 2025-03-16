import type { ComponentInternalInstance } from 'vue'
import { onActivated, onDeactivated, ref } from 'vue'
import type { User } from '@prisma/client'

export const isHydrated = ref(false)

export const userObject = ref<User | null>(null)

/**
 * ### Whether the current component is running in the background
 *
 * for handling problems caused by the keepalive function
 */
export function useDeactivated() {
  const deactivated = ref(false)
  onActivated(() => deactivated.value = false)
  onDeactivated(() => deactivated.value = true)

  return deactivated
}

/**
 * ### When the component is restored from the background
 *
 * for handling problems caused by the keepalive function
 */
export function onReactivated(hook: () => void, target?: ComponentInternalInstance | null): void {
  const initial = ref(true)
  onActivated(() => {
    if (initial.value)
      return
    hook()
  }, target)
  onDeactivated(() => initial.value = false)
}

export function onHydrated(cb: () => unknown) {
  watchOnce(isHydrated, () => cb(), { immediate: isHydrated.value })
}

// export function debounce(func: () => void, timeout = 300) {
//   let timer: ReturnType<typeof setTimeout>
//   return (...args: unknown[]) => {
//     clearTimeout(timer)
//     timer = setTimeout(() => { func.apply(this, args) }, timeout)
//   }
// }
