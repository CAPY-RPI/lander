import { useEffect } from 'react'
import type { RefObject } from 'react'

function isSafariBrowser() {
  if (typeof navigator === 'undefined') {
    return false
  }

  const userAgent = navigator.userAgent
  return /Safari/i.test(userAgent) && !/Chrome|Chromium|CriOS|EdgiOS|FxiOS/i.test(userAgent)
}

/**
 * Adds a Safari-only wheel fallback for nested horizontal rails.
 *
 * Safari can fail to hand trackpad and wheel gestures to nested horizontal
 * overflow containers when a parent also participates in scroll handling.
 */
export function useSafariHorizontalRailFallback(
  railRef: RefObject<HTMLElement | null>,
  speed = 1,
): void {
  useEffect(() => {
    const rail = railRef.current
    if (!rail || !isSafariBrowser()) return

    const onWheel = (event: WheelEvent) => {
      const maxScrollLeft = Math.max(0, rail.scrollWidth - rail.clientWidth)
      if (maxScrollLeft <= 0) {
        return
      }

      const intent = Math.abs(event.deltaX) > 0 ? event.deltaX : event.deltaY
      if (intent === 0) {
        return
      }

      const isAtStart = rail.scrollLeft <= 0
      const isAtEnd = rail.scrollLeft >= maxScrollLeft

      if ((intent < 0 && isAtStart) || (intent > 0 && isAtEnd)) {
        return
      }

      event.preventDefault()
      event.stopPropagation()

      const next = rail.scrollLeft + intent * speed
      rail.scrollLeft = Math.min(maxScrollLeft, Math.max(0, next))
    }

    rail.addEventListener('wheel', onWheel, { passive: false })

    return () => {
      rail.removeEventListener('wheel', onWheel)
    }
  }, [railRef, speed])
}
