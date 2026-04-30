import { useEffect, useRef, useState } from 'react'

/**
 * Hook to calculate reveal/animation progress for horizontally scrolled panels or cards.
 * Returns: [ref, { centerDelta, progress }]
 *
 * @param triggerAmount - Fraction of element width that must be visible to fully trigger (default: 0.3)
 */
export function useRevealProgress<T extends HTMLElement = HTMLElement>(triggerAmount = 0.3) {
  const ref = useRef<T | null>(null)
  const [centerDelta, setCenterDelta] = useState(1)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      const node = ref.current
      if (!node) return
      const rect = node.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportCenter = viewportWidth / 2
      const elementCenter = rect.left + rect.width / 2
      const nextCenterDelta = elementCenter - viewportCenter
      setCenterDelta((prev) => (Math.abs(prev - nextCenterDelta) < 0.1 ? prev : nextCenterDelta))
      const visibleLeft = Math.max(rect.left, 0)
      const visibleRight = Math.min(rect.right, viewportWidth)
      const visibleWidth = Math.max(0, visibleRight - visibleLeft)
      const maxVisibleWidth = Math.min(rect.width, viewportWidth)
      const triggerDistance = Math.max(1, maxVisibleWidth * triggerAmount)
      const nextProgress = Math.min(1, visibleWidth / triggerDistance)
      setProgress((prev) => (Math.abs(prev - nextProgress) < 0.001 ? prev : nextProgress))
    }

    update()

    const node = ref.current
    const scrollTargets = new Set<HTMLElement | Window>()
    const revealScroller = node?.closest('[data-reveal-scroller]') as HTMLElement | null
    const pageScroller = node?.closest('#scroller') as HTMLElement | null

    if (revealScroller) {
      scrollTargets.add(revealScroller)
    }

    if (pageScroller) {
      scrollTargets.add(pageScroller)
    }

    if (scrollTargets.size === 0) {
      scrollTargets.add(window)
    }

    scrollTargets.forEach((target) => {
      target.addEventListener('scroll', update, { passive: true })
    })

    window.addEventListener('resize', update)
    return () => {
      scrollTargets.forEach((target) => {
        target.removeEventListener('scroll', update)
      })
      window.removeEventListener('resize', update)
    }
  }, [triggerAmount])

  return [ref, { centerDelta, progress }] as const
}
