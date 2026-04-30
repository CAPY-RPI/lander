import { useEffect } from 'react'

type ShortcutHandlers = {
  switchHome: () => void
  switchEvents: () => void
  switchOrgs: () => void
  switchProfile: () => void
  openSearch: () => void
}

function isTypingInInput(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false

  const tag = target.tagName.toLowerCase()

  return tag === 'input' || tag === 'textarea' || target.isContentEditable
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isTypingInInput(event.target)) return

      if (event.ctrlKey && event.key === 'k') {
        event.preventDefault()
        handlers.openSearch()
        return
      }

      // Naviigation shortcuts
      if (event.key === 'h') handlers.switchHome()
      if (event.key === 'e') handlers.switchEvents()
      if (event.key === 'o') handlers.switchOrgs()
      if (event.key === 'p') handlers.switchProfile()
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [handlers])
}
