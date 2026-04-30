import { useEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import type { ScrollControl } from './useNavScrollSync'

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

interface UseNavBubbleDragOptions {
  items: NavItem[]
  navRef: React.MutableRefObject<HTMLElement | null>
  bubbleX: number
  bubbleWidth: number
  navigateToHref: (href: string) => void
  setActiveHref: (href: string) => void
  getNavSnapCandidates: (scroller: HTMLElement) => SnapCandidate[]
  mapBubbleXToScrollLeft: (x: number, candidates: SnapCandidate[]) => number
  scrollControl: ScrollControl
}

interface NavBubbleDragReturn {
  dragBubbleX: number | null
  bubbleDragging: boolean
  onNavPointerDownCapture: (event: ReactPointerEvent<HTMLElement>) => void
}

/**
 * Manages the drag interaction for the TopNav bubble indicator.
 * Handles pointer capture, drag-to-scroll, and snap-on-release.
 */
export function useNavBubbleDrag({
  items,
  navRef,
  bubbleX,
  bubbleWidth,
  navigateToHref,
  setActiveHref,
  getNavSnapCandidates,
  mapBubbleXToScrollLeft,
  scrollControl,
}: UseNavBubbleDragOptions): NavBubbleDragReturn {
  const {
    isProgrammatic: isProgrammaticRef,
    pendingScrollLeft: pendingScrollLeftRef,
    scrollRaf: scrollRafRef,
    releaseTimer: releaseTimerRef,
    isBubbleDragging: isBubbleDraggingRef,
  } = scrollControl

  const navPointerIdRef = useRef<number | null>(null)
  const bubbleDragStartClientXRef = useRef(0)
  const bubbleDragStartXRef = useRef(0)

  const [dragBubbleX, setDragBubbleX] = useState<number | null>(null)
  const [bubbleDragging, setBubbleDragging] = useState(false)

  const onNavPointerDownCapture = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.button !== 0) return

    const navNode = event.currentTarget
    const navRect = navNode.getBoundingClientRect()
    const localX = event.clientX - navRect.left
    const visualBubbleX = dragBubbleX ?? bubbleX
    const isInsideBubble = localX >= visualBubbleX && localX <= visualBubbleX + bubbleWidth
    if (!isInsideBubble) return

    navNode.setPointerCapture(event.pointerId)
    navPointerIdRef.current = event.pointerId
    bubbleDragStartClientXRef.current = event.clientX
    bubbleDragStartXRef.current = visualBubbleX
    isBubbleDraggingRef.current = true
    setBubbleDragging(true)
    setDragBubbleX(visualBubbleX)

    if (scrollRafRef.current != null) {
      window.cancelAnimationFrame(scrollRafRef.current)
      scrollRafRef.current = null
    }
    if (releaseTimerRef.current != null) {
      window.clearTimeout(releaseTimerRef.current)
      releaseTimerRef.current = null
    }

    isProgrammaticRef.current = true
    pendingScrollLeftRef.current = null

    const scroller = document.getElementById('scroller') as HTMLElement | null
    if (scroller) scroller.style.scrollSnapType = 'none'

    event.preventDefault()
  }

  useEffect(() => {
    const onPointerMove = (event: globalThis.PointerEvent) => {
      if (!isBubbleDraggingRef.current || navPointerIdRef.current !== event.pointerId) {
        return
      }

      const navNode = navRef.current
      const scroller = document.getElementById('scroller') as HTMLElement | null
      if (!navNode || !scroller) return

      const candidates = getNavSnapCandidates(scroller)
      if (candidates.length === 0) return

      const minX = candidates[0].x
      const maxX = candidates[candidates.length - 1].x
      const proposedX =
        bubbleDragStartXRef.current + (event.clientX - bubbleDragStartClientXRef.current)
      const clampedX = Math.max(minX, Math.min(maxX, proposedX))

      setDragBubbleX(clampedX)

      const nextScrollLeft = mapBubbleXToScrollLeft(clampedX, candidates)
      scroller.scrollLeft = nextScrollLeft
      event.preventDefault()
    }

    const endPointerDrag = (event: globalThis.PointerEvent) => {
      if (!isBubbleDraggingRef.current || navPointerIdRef.current !== event.pointerId) {
        return
      }

      const scroller = document.getElementById('scroller') as HTMLElement | null
      if (scroller) {
        const candidates = getNavSnapCandidates(scroller)
        if (candidates.length > 0) {
          const currentX = dragBubbleX ?? bubbleX
          let nearest = candidates[0]
          for (const candidate of candidates) {
            if (Math.abs(candidate.x - currentX) < Math.abs(nearest.x - currentX)) {
              nearest = candidate
            }
          }

          setActiveHref(nearest.href)
          navigateToHref(nearest.href)
        } else {
          scroller.style.scrollSnapType = ''
        }
      }

      isBubbleDraggingRef.current = false
      navPointerIdRef.current = null
      setBubbleDragging(false)
      setDragBubbleX(null)
      isProgrammaticRef.current = false
      pendingScrollLeftRef.current = null

      const navNode = navRef.current
      if (navNode && navNode.hasPointerCapture(event.pointerId)) {
        navNode.releasePointerCapture(event.pointerId)
      }
    }

    window.addEventListener('pointermove', onPointerMove, { passive: false })
    window.addEventListener('pointerup', endPointerDrag)
    window.addEventListener('pointercancel', endPointerDrag)
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', endPointerDrag)
      window.removeEventListener('pointercancel', endPointerDrag)
    }
  }, [
    items,
    bubbleWidth,
    bubbleX,
    dragBubbleX,
    navRef,
    navigateToHref,
    setActiveHref,
    getNavSnapCandidates,
    mapBubbleXToScrollLeft,
    isBubbleDraggingRef,
    isProgrammaticRef,
    pendingScrollLeftRef,
    scrollRafRef,
    releaseTimerRef,
  ])

  return {
    dragBubbleX,
    bubbleDragging,
    onNavPointerDownCapture,
  }
}
