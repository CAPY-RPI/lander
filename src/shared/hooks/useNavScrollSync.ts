import { useCallback, useEffect, useRef, useState } from 'react'

interface NavItem {
  label: string
  href: string
}

interface SnapCandidate {
  href: string
  x: number
  width: number
  targetLeft: number
}

/**
 * Refs shared between useNavScrollSync and useNavBubbleDrag
 * to coordinate programmatic scrolling and drag state.
 */
export interface ScrollControl {
  isProgrammatic: React.MutableRefObject<boolean>
  pendingScrollLeft: React.MutableRefObject<number | null>
  scrollRaf: React.MutableRefObject<number | null>
  releaseTimer: React.MutableRefObject<number | null>
  isBubbleDragging: React.MutableRefObject<boolean>
}

export interface NavScrollSyncReturn {
  activeHref: string
  setActiveHref: (href: string) => void
  bubbleX: number
  bubbleWidth: number
  bubbleReady: boolean
  navigateToHref: (href: string) => void
  getNavSnapCandidates: (scroller: HTMLElement) => SnapCandidate[]
  mapBubbleXToScrollLeft: (x: number, candidates: SnapCandidate[]) => number
  scrollControl: ScrollControl
}

const easeInOutQuart = (t: number) =>
  t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2

/**
 * Manages the scroll ↔ active-link synchronization and animated programmatic scrolling
 * for the TopNav bubble indicator.
 */
export function useNavScrollSync(
  items: NavItem[],
  linkRefs: React.MutableRefObject<Record<string, HTMLAnchorElement | null>>,
  navRef: React.MutableRefObject<HTMLElement | null>,
): NavScrollSyncReturn {
  const isProgrammaticScrollRef = useRef(false)
  const pendingScrollLeftRef = useRef<number | null>(null)
  const scrollRafRef = useRef<number | null>(null)
  const releaseTimerRef = useRef<number | null>(null)
  const isBubbleDraggingRef = useRef(false)

  const [activeHref, setActiveHref] = useState(items[0]?.href ?? '#home')
  const [bubbleX, setBubbleX] = useState(0)
  const [bubbleWidth, setBubbleWidth] = useState(0)
  const [bubbleReady, setBubbleReady] = useState(false)

  const scrollControl: ScrollControl = {
    isProgrammatic: isProgrammaticScrollRef,
    pendingScrollLeft: pendingScrollLeftRef,
    scrollRaf: scrollRafRef,
    releaseTimer: releaseTimerRef,
    isBubbleDragging: isBubbleDraggingRef,
  }

  const getNavSnapCandidates = (scroller: HTMLElement): SnapCandidate[] => {
    const maxLeft = Math.max(0, scroller.scrollWidth - scroller.clientWidth)

    return items
      .map((item) => {
        const link = linkRefs.current[item.href]
        if (!link) return null

        const section = document.getElementById(item.href.replace('#', ''))
        if (!section) return null

        const sectionCenter = section.offsetLeft + section.offsetWidth / 2
        const rawLeft = sectionCenter - scroller.clientWidth / 2
        const targetLeft = Math.max(0, Math.min(rawLeft, maxLeft))

        return {
          href: item.href,
          x: link.offsetLeft,
          width: link.offsetWidth,
          targetLeft,
        }
      })
      .filter((value): value is SnapCandidate => value != null)
      .sort((a, b) => a.x - b.x)
  }

  const mapBubbleXToScrollLeft = (x: number, candidates: SnapCandidate[]) => {
    if (candidates.length === 0) return 0
    if (candidates.length === 1) return candidates[0].targetLeft

    if (x <= candidates[0].x) return candidates[0].targetLeft
    if (x >= candidates[candidates.length - 1].x)
      return candidates[candidates.length - 1].targetLeft

    for (let i = 0; i < candidates.length - 1; i += 1) {
      const left = candidates[i]
      const right = candidates[i + 1]
      if (x < left.x || x > right.x) continue

      const span = Math.max(1, right.x - left.x)
      const t = (x - left.x) / span
      return left.targetLeft + (right.targetLeft - left.targetLeft) * t
    }

    return candidates[candidates.length - 1].targetLeft
  }

  // Sync active href from scroll position
  useEffect(() => {
    const updateActiveFromScroll = () => {
      const scroller = document.getElementById('scroller') as HTMLElement | null
      if (!scroller) return

      if (isBubbleDraggingRef.current) return

      if (isProgrammaticScrollRef.current) {
        const pendingLeft = pendingScrollLeftRef.current
        if (pendingLeft == null || Math.abs(scroller.scrollLeft - pendingLeft) > 2) {
          return
        }

        isProgrammaticScrollRef.current = false
        pendingScrollLeftRef.current = null
      }

      const viewportCenter = scroller.scrollLeft + scroller.clientWidth / 2
      let nextActive = items[0]?.href ?? '#home'
      let smallestDelta = Number.POSITIVE_INFINITY

      for (const item of items) {
        const id = item.href.replace('#', '')
        const section = document.getElementById(id)
        if (!section) continue

        const sectionCenter = section.offsetLeft + section.offsetWidth / 2
        const delta = Math.abs(sectionCenter - viewportCenter)
        if (delta < smallestDelta) {
          smallestDelta = delta
          nextActive = item.href
        }
      }

      setActiveHref((prev) => (prev === nextActive ? prev : nextActive))
    }

    updateActiveFromScroll()
    const scroller = document.getElementById('scroller') as HTMLElement | null
    scroller?.addEventListener('scroll', updateActiveFromScroll, { passive: true })
    window.addEventListener('resize', updateActiveFromScroll)

    return () => {
      scroller?.removeEventListener('scroll', updateActiveFromScroll)
      window.removeEventListener('resize', updateActiveFromScroll)
      if (releaseTimerRef.current != null) {
        window.clearTimeout(releaseTimerRef.current)
      }
      if (scrollRafRef.current != null) {
        window.cancelAnimationFrame(scrollRafRef.current)
      }
    }
  }, [items])

  // Sync bubble position from active href
  useEffect(() => {
    const updateBubble = () => {
      const navNode = navRef.current
      const activeNode = linkRefs.current[activeHref]
      if (!navNode || !activeNode) {
        setBubbleReady(false)
        return
      }

      setBubbleX(activeNode.offsetLeft)
      setBubbleWidth(activeNode.offsetWidth)
      setBubbleReady(true)
    }

    updateBubble()
    window.addEventListener('resize', updateBubble)
    return () => window.removeEventListener('resize', updateBubble)
  }, [activeHref, navRef, linkRefs])

  // Animated programmatic scroll to a section
  const navigateToHref = useCallback((href: string) => {
    const targetId = href.replace('#', '')
    const scroller = document.getElementById('scroller') as HTMLElement | null
    const target = document.getElementById(targetId)

    if (!scroller || !target) {
      window.location.assign(href)
      return
    }

    const targetCenter = target.offsetLeft + target.offsetWidth / 2
    const rawLeft = targetCenter - scroller.clientWidth / 2
    const maxLeft = Math.max(0, scroller.scrollWidth - scroller.clientWidth)
    const targetLeft = Math.max(0, Math.min(rawLeft, maxLeft))
    const startLeft = scroller.scrollLeft
    const distance = targetLeft - startLeft

    if (Math.abs(distance) < 1) {
      scroller.scrollLeft = targetLeft
      scroller.style.scrollSnapType = ''
      setActiveHref(href)
      return
    }

    isProgrammaticScrollRef.current = true
    pendingScrollLeftRef.current = targetLeft
    scroller.style.scrollSnapType = 'none'

    if (scrollRafRef.current != null) {
      window.cancelAnimationFrame(scrollRafRef.current)
      scrollRafRef.current = null
    }

    if (releaseTimerRef.current != null) {
      window.clearTimeout(releaseTimerRef.current)
    }

    const durationMs = Math.min(560, Math.max(220, Math.abs(distance) * 0.4))
    let startedAt: number | null = null

    const tick = (now: number) => {
      if (startedAt == null) {
        startedAt = now
      }

      const elapsed = now - startedAt
      const t = Math.min(1, elapsed / durationMs)
      const eased = easeInOutQuart(t)

      scroller.scrollLeft = startLeft + distance * eased

      if (t < 1) {
        scrollRafRef.current = window.requestAnimationFrame(tick)
        return
      }

      scroller.scrollLeft = targetLeft
      scroller.style.scrollSnapType = ''
      isProgrammaticScrollRef.current = false
      pendingScrollLeftRef.current = null
      scrollRafRef.current = null
    }

    releaseTimerRef.current = window.setTimeout(() => {
      isProgrammaticScrollRef.current = false
      pendingScrollLeftRef.current = null
      if (scrollRafRef.current != null) {
        window.cancelAnimationFrame(scrollRafRef.current)
        scrollRafRef.current = null
      }
      scroller.style.scrollSnapType = ''
    }, durationMs + 120)

    scrollRafRef.current = window.requestAnimationFrame(tick)
    setActiveHref(href)
  }, [])

  return {
    activeHref,
    setActiveHref,
    bubbleX,
    bubbleWidth,
    bubbleReady,
    navigateToHref,
    getNavSnapCandidates,
    mapBubbleXToScrollLeft,
    scrollControl,
  }
}
