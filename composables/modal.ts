export const isParticipantsDropdownOpen = ref(false)

export const isChatRenameOpen = ref(false)

export const isModalInChatOpen = computed({
  get() {
    return isParticipantsDropdownOpen.value || isChatRenameOpen.value
  },
  set(value) {
    isParticipantsDropdownOpen.value = value
    isChatRenameOpen.value = value
  },
})

export const visible = ref(false)
