import { useEffect } from 'react'
import type { RefObject } from 'react'

/**
 * Handles explicit horizontal wheel input for nested rails.
 *
 * This consumes true horizontal deltas (`deltaX`) while allowing vertical wheel
 * input to keep bubbling to the page-level horizontal scroller.
 */
export function useHorizontalRailWheelScroll(
  railRef: RefObject<HTMLElement | null>,
  speed = 1,
): void {
  useEffect(() => {
    const rail = railRef.current
    if (!rail) return

    const onWheel = (event: WheelEvent) => {
      const maxScrollLeft = Math.max(0, rail.scrollWidth - rail.clientWidth)
      if (maxScrollLeft <= 0) {
        return
      }

      const horizontalIntent = event.deltaX
      if (Math.abs(horizontalIntent) < 0.5) {
        return
      }

      const isAtStart = rail.scrollLeft <= 0
      const isAtEnd = rail.scrollLeft >= maxScrollLeft

      if ((horizontalIntent < 0 && isAtStart) || (horizontalIntent > 0 && isAtEnd)) {
        return
      }

      event.preventDefault()
      event.stopPropagation()

      const next = rail.scrollLeft + horizontalIntent * speed
      rail.scrollLeft = Math.min(maxScrollLeft, Math.max(0, next))
    }

    rail.addEventListener('wheel', onWheel, { passive: false })

    return () => {
      rail.removeEventListener('wheel', onWheel)
    }
  }, [railRef, speed])
}
