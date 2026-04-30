import { useEffect } from 'react'
import type { RefObject } from 'react'

type HorizontalWheelOptions = {
  speed?: number
  endCutoffPx?: number
  releaseOnEdges?: boolean
  ignoreInteractiveElements?: boolean
  enableDrag?: boolean
}

/**
 * Enables smooth horizontal scrolling for a container element using mouse wheel or drag interactions.
 *
 * @param scrollerRef - A React RefObject pointing to the scrollable container HTMLElement.
 * @param options - Configuration options for the scrolling behavior.
 * @param options.speed - The multiplier for scroll speed when using the mouse wheel (default: 1.1).
 * @param options.endCutoffPx - The number of pixels from the end of the scroll width to treat as the maximum scroll threshold (default: 180).
 * @param options.releaseOnEdges - Allows parent scrollers to receive wheel input once this scroller reaches an edge (default: false).
 * @param options.ignoreInteractiveElements - Prevents drag-to-scroll from starting on controls like buttons or inputs (default: true).
 * @param options.enableDrag - Enables mouse drag-to-scroll interactions for the target scroller (default: true).
 */
export function useHorizontalWheelScroll(
  scrollerRef: RefObject<HTMLElement | null>,
  options: HorizontalWheelOptions = {},
): void {
  const {
    speed = 1.1,
    endCutoffPx = 180,
    releaseOnEdges = false,
    ignoreInteractiveElements = true,
    enableDrag = true,
  } = options

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return

    const getNestedHorizontalScroller = (event: WheelEvent) => {
      const eventPath = typeof event.composedPath === 'function' ? event.composedPath() : []

      for (const node of eventPath) {
        if (!(node instanceof HTMLElement)) {
          continue
        }

        if (node === scroller) {
          break
        }

        if (node.hasAttribute('data-native-horizontal-scroll')) {
          return node
        }
      }

      const target = event.target as HTMLElement | null
      const nestedScroller = target?.closest(
        '[data-native-horizontal-scroll]',
      ) as HTMLElement | null
      if (!nestedScroller || nestedScroller === scroller) {
        return null
      }

      return nestedScroller
    }

    const canNestedScrollerConsume = (event: WheelEvent, intent: number) => {
      const nestedScroller = getNestedHorizontalScroller(event)
      if (!nestedScroller) {
        return false
      }

      const maxScrollLeft = Math.max(0, nestedScroller.scrollWidth - nestedScroller.clientWidth)
      if (maxScrollLeft <= 0) {
        return false
      }

      if (intent < 0) {
        return nestedScroller.scrollLeft > 0
      }

      if (intent > 0) {
        return nestedScroller.scrollLeft < maxScrollLeft
      }

      return false
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

      if (canNestedScrollerConsume(event, intent)) {
        return
      }

      const maxScrollLeft = getMaxScrollLeft()
      const isAtStart = scroller.scrollLeft <= 0
      const isAtEnd = scroller.scrollLeft >= maxScrollLeft

      if (releaseOnEdges && ((intent < 0 && isAtStart) || (intent > 0 && isAtEnd))) {
        return
      }

      event.preventDefault()
      event.stopPropagation()
      const next = scroller.scrollLeft + intent * speed
      scroller.scrollLeft = Math.min(maxScrollLeft, Math.max(0, next))
    }

    const onScroll = () => {
      clampScrollPosition()
    }

    let isMouseDragging = false
    let hasActivatedDrag = false
    let suppressNextClick = false
    let dragStartX = 0
    let dragStartScrollLeft = 0
    const dragThresholdPx = 6

    const onMouseDown = (event: MouseEvent) => {
      if (event.button !== 0) return

      const target = event.target as HTMLElement | null
      if (ignoreInteractiveElements && target?.closest('button, input, textarea, select, label')) {
        return
      }

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
        scroller.style.scrollSnapType = 'none'
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
      scroller.style.scrollSnapType = ''
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
    if (enableDrag) {
      scroller.addEventListener('mousedown', onMouseDown)
      scroller.addEventListener('dragstart', onNativeDragStart)
      scroller.addEventListener('click', onClickCapture, true)
      window.addEventListener('mousemove', onMouseMove, { passive: false })
      window.addEventListener('mouseup', endMouseDrag)
    }

    return () => {
      scroller.removeEventListener('wheel', onWheel)
      scroller.removeEventListener('scroll', onScroll)

      if (enableDrag) {
        scroller.removeEventListener('mousedown', onMouseDown)
        scroller.removeEventListener('dragstart', onNativeDragStart)
        scroller.removeEventListener('click', onClickCapture, true)
        window.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('mouseup', endMouseDrag)
      }

      scroller.classList.remove('is-dragging')
    }
  }, [scrollerRef, speed, endCutoffPx, releaseOnEdges, ignoreInteractiveElements, enableDrag])
}
