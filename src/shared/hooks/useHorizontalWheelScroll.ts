import { useEffect } from 'react'
import type { RefObject } from 'react'

type HorizontalWheelOptions = {
  speed?: number
  endCutoffPx?: number
  snap?: boolean
}

const easeInOutQuart = (t: number) =>
  t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2

/**
 * Enables smooth horizontal scrolling for a container element using mouse wheel or drag interactions.
 *
 * @param scrollerRef - A React RefObject pointing to the scrollable container HTMLElement.
 * @param options - Configuration options for the scrolling behavior.
 * @param options.speed - The multiplier for scroll speed when using the mouse wheel (default: 1.1).
 * @param options.endCutoffPx - The number of pixels from the end of the scroll width to treat as the maximum scroll threshold (default: 180).
 */
export function useHorizontalWheelScroll(
  scrollerRef: RefObject<HTMLElement | null>,
  options: HorizontalWheelOptions = {},
): void {
  const { speed = 1.1, endCutoffPx = 180, snap = false } = options

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return

    let scrollRaf: number | null = null
    let snapTimer: number | null = null
    let isProgrammatic = false

    const animateTo = (targetLeft: number) => {
      if (scrollRaf != null) cancelAnimationFrame(scrollRaf)
      isProgrammatic = true

      const startLeft = scroller.scrollLeft
      const distance = targetLeft - startLeft
      const duration = Math.min(560, Math.max(320, Math.abs(distance) * 0.4))
      let startTime: number | null = null

      const step = (now: number) => {
        if (startTime === null) startTime = now
        const elapsed = now - startTime
        const t = Math.min(1, elapsed / duration)
        const eased = easeInOutQuart(t)

        scroller.scrollLeft = startLeft + distance * eased

        if (t < 1) {
          scrollRaf = requestAnimationFrame(step)
        } else {
          scroller.scrollLeft = targetLeft
          isProgrammatic = false
          scrollRaf = null
        }
      }
      scrollRaf = requestAnimationFrame(step)
    }

    const snapToNearest = () => {
      if (!snap || isProgrammatic) return
      const panels = Array.from(scroller.querySelectorAll('.panel')) as HTMLElement[]
      if (panels.length === 0) return

      const viewportCenter = scroller.scrollLeft + scroller.clientWidth / 2
      let closestPanel: HTMLElement | null = null
      let minDistance = Infinity

      panels.forEach((panel) => {
        const panelCenter = panel.offsetLeft + panel.offsetWidth / 2
        const distance = Math.abs(viewportCenter - panelCenter)
        if (distance < minDistance) {
          minDistance = distance
          closestPanel = panel
        }
      })

      if (closestPanel) {
        const target =
          (closestPanel as HTMLElement).offsetLeft +
          (closestPanel as HTMLElement).offsetWidth / 2 -
          scroller.clientWidth / 2
        animateTo(target)
      }
    }

    const getMaxScrollLeft = () =>
      Math.max(0, scroller.scrollWidth - scroller.clientWidth - endCutoffPx)

    const clampScrollPosition = () => {
      const maxScrollLeft = getMaxScrollLeft()
      if (scroller.scrollLeft > maxScrollLeft) {
        scroller.scrollLeft = maxScrollLeft
      }

      if (scroller.scrollLeft < 0) {
        scroller.scrollLeft = 0
      }
    }

    const onWheel = (event: WheelEvent) => {
      const hasHorizontalOverflow = scroller.scrollWidth > scroller.clientWidth
      if (!hasHorizontalOverflow) return

      const intent = Math.abs(event.deltaY) > Math.abs(event.deltaX) ? event.deltaY : event.deltaX
      if (intent === 0) return

      event.preventDefault()
      const next = scroller.scrollLeft + intent * speed
      const maxScrollLeft = getMaxScrollLeft()
      scroller.scrollLeft = Math.min(maxScrollLeft, Math.max(0, next))

      if (snap) {
        if (snapTimer != null) clearTimeout(snapTimer)
        snapTimer = window.setTimeout(snapToNearest, 150)
      }
    }

    const onScroll = () => {
      clampScrollPosition()
      if (snap && !isProgrammatic && !isMouseDragging && !isTouching) {
        if (snapTimer != null) clearTimeout(snapTimer)
        snapTimer = window.setTimeout(snapToNearest, 150)
      }
    }

    const onScrollEnd = () => {
      if (snap && !isProgrammatic && !isMouseDragging && !isTouching) {
        snapToNearest()
      }
    }

    let isMouseDragging = false
    let isTouching = false
    let hasActivatedDrag = false
    let suppressNextClick = false
    let dragStartX = 0
    let dragStartScrollLeft = 0
    const dragThresholdPx = 6

    const onTouchStart = () => {
      isTouching = true
      if (snapTimer != null) clearTimeout(snapTimer)
    }

    const onTouchEnd = () => {
      isTouching = false
      if (snap) snapToNearest()
    }

    const onMouseDown = (event: MouseEvent) => {
      if (event.button !== 0) return

      const target = event.target as HTMLElement | null
      if (target?.closest('button, input, textarea, select, label')) return

      isMouseDragging = true
      hasActivatedDrag = false
      dragStartX = event.clientX
      dragStartScrollLeft = scroller.scrollLeft
    }

    const onMouseMove = (event: MouseEvent) => {
      if (!isMouseDragging) return

      const deltaX = event.clientX - dragStartX
      if (!hasActivatedDrag && Math.abs(deltaX) < dragThresholdPx) {
        return
      }

      if (!hasActivatedDrag) {
        hasActivatedDrag = true
        scroller.classList.add('is-dragging')
      }

      const maxScrollLeft = getMaxScrollLeft()
      const next = dragStartScrollLeft - deltaX
      scroller.scrollLeft = Math.min(maxScrollLeft, Math.max(0, next))
      event.preventDefault()
    }

    const endMouseDrag = () => {
      if (!isMouseDragging) return

      if (hasActivatedDrag) {
        suppressNextClick = true
      }

      isMouseDragging = false
      hasActivatedDrag = false
      scroller.classList.remove('is-dragging')

      if (snap) snapToNearest()
    }

    const onClickCapture = (event: MouseEvent) => {
      if (!suppressNextClick) return

      event.preventDefault()
      event.stopPropagation()
      suppressNextClick = false
    }

    const onNativeDragStart = (event: DragEvent) => {
      if (isMouseDragging) {
        event.preventDefault()
      }
    }

    clampScrollPosition()

    scroller.addEventListener('wheel', onWheel, { passive: false })
    scroller.addEventListener('scroll', onScroll, { passive: true })
    scroller.addEventListener('scrollend', onScrollEnd)
    scroller.addEventListener('touchstart', onTouchStart, { passive: true })
    scroller.addEventListener('touchend', onTouchEnd, { passive: true })
    scroller.addEventListener('mousedown', onMouseDown)
    scroller.addEventListener('dragstart', onNativeDragStart)
    scroller.addEventListener('click', onClickCapture, true)
    window.addEventListener('mousemove', onMouseMove, { passive: false })
    window.addEventListener('mouseup', endMouseDrag)
    return () => {
      scroller.removeEventListener('wheel', onWheel)
      scroller.removeEventListener('scroll', onScroll)
      scroller.removeEventListener('scrollend', onScrollEnd)
      scroller.removeEventListener('touchstart', onTouchStart)
      scroller.removeEventListener('touchend', onTouchEnd)
      scroller.removeEventListener('mousedown', onMouseDown)
      scroller.removeEventListener('dragstart', onNativeDragStart)
      scroller.removeEventListener('click', onClickCapture, true)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', endMouseDrag)
      scroller.classList.remove('is-dragging')
      if (snapTimer != null) clearTimeout(snapTimer)
      if (scrollRaf != null) cancelAnimationFrame(scrollRaf)
    }
  }, [scrollerRef, speed, endCutoffPx, snap])
}
