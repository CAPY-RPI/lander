import { useCallback, useEffect, useRef, useState } from 'react'
import type { MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { StaggerWords } from './StaggerWords'
import { assets, navItems } from '../data/content'
import { useExitNavigation } from '../hooks/useExitNavigation'
import { PillButton } from './PillButton'
import styles from './TopNav.module.css'

type SnapCandidate = {
  href: string
  x: number
  width: number
  targetLeft: number
}

interface TopNavProps {
  items?: typeof navItems
  showCta?: boolean
  ctaLabel?: string
  ctaHref?: string
  onCtaClickOverride?: (event: ReactMouseEvent<HTMLAnchorElement>) => void
}

const easeInOutQuart = (t: number) =>
  t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2

export function TopNav({
  items = navItems,
  showCta = true,
  ctaLabel = "let's go",
  ctaHref = '/app',
  onCtaClickOverride,
}: TopNavProps) {
  const navigateWithExit = useExitNavigation()
  const navRef = useRef<HTMLElement | null>(null)
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({})
  const isProgrammaticScrollRef = useRef(false)
  const isBubbleDraggingRef = useRef(false)
  const navPointerIdRef = useRef<number | null>(null)
  const bubbleDragStartClientXRef = useRef(0)
  const bubbleDragStartXRef = useRef(0)
  const pendingScrollLeftRef = useRef<number | null>(null)
  const releaseTimerRef = useRef<number | null>(null)
  const scrollRafRef = useRef<number | null>(null)
  const [activeHref, setActiveHref] = useState(items[0]?.href ?? '#home')
  const [bubbleX, setBubbleX] = useState(0)
  const [bubbleWidth, setBubbleWidth] = useState(0)
  const [dragBubbleX, setDragBubbleX] = useState<number | null>(null)
  const [bubbleDragging, setBubbleDragging] = useState(false)
  const [bubbleReady, setBubbleReady] = useState(false)

  const getNavSnapCandidates = useCallback(
    (scroller: HTMLElement): SnapCandidate[] => {
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
    },
    [items],
  )

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

  useEffect(() => {
    const updateActiveFromScroll = () => {
      const scroller = document.getElementById('scroller') as HTMLElement | null
      if (!scroller) return

      if (isBubbleDraggingRef.current) {
        return
      }

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

  useEffect(() => {
    const updateBubble = () => {
      const navNode = navRef.current
      const activeNode = linkRefs.current[activeHref]
      if (!navNode || !activeNode) {
        setBubbleReady(false)
        return
      }

      const nextX = activeNode.offsetLeft
      const nextWidth = activeNode.offsetWidth
      setBubbleX(nextX)
      setBubbleWidth(nextWidth)
      setBubbleReady(true)
    }

    updateBubble()
    window.addEventListener('resize', updateBubble)
    return () => window.removeEventListener('resize', updateBubble)
  }, [activeHref])

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

  const onBrandClick = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    if (window.location.pathname === '/') {
      event.preventDefault()
      const homeSection = document.getElementById('home')
      if (homeSection) {
        homeSection.scrollIntoView({ behavior: 'smooth' })
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } else {
      navigateWithExit(event, '/')
    }
  }

  const handleNavigate = (href: string) => (event: ReactMouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    navigateToHref(href)
  }

  const onAppCtaClick = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    if (onCtaClickOverride) {
      onCtaClickOverride(event)
      return
    }

    if (ctaHref.startsWith('/') && !ctaHref.startsWith('/api')) {
      navigateWithExit(event, ctaHref)
    }
  }

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

    isProgrammaticScrollRef.current = true
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
      isProgrammaticScrollRef.current = false
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
  }, [bubbleWidth, bubbleX, dragBubbleX, navigateToHref, getNavSnapCandidates])

  return (
    <motion.header
      className={styles.topNav}
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <a href="/" onClick={onBrandClick} className={styles.brandLink}>
        <img src={assets.logo} alt="Capy logo" className={styles.brandLogo} />
      </a>

      <nav
        aria-label="Primary navigation"
        className={`${styles.navPill} ${bubbleDragging ? styles.isDragging : ''}`}
        ref={navRef}
        onPointerDownCapture={onNavPointerDownCapture}
      >
        <motion.span
          className={`${styles.navBubble} ${bubbleDragging ? styles.isDragging : ''}`}
          aria-hidden="true"
          initial={false}
          animate={{
            x: dragBubbleX ?? bubbleX,
            width: bubbleWidth,
            opacity: bubbleReady ? 1 : 0,
          }}
          transition={
            bubbleDragging
              ? { duration: 0 }
              : {
                  type: 'spring',
                  stiffness: 320,
                  damping: 20,
                  mass: 0.8,
                }
          }
        />
        {items.map((item) => (
          <a
            key={item.label}
            href={item.href}
            ref={(node) => {
              linkRefs.current[item.href] = node
            }}
            className={activeHref === item.href ? styles.isActive : undefined}
            onClick={handleNavigate(item.href)}
            onDragStart={(event) => event.preventDefault()}
          >
            <StaggerWords text={item.label} baseDelay={0.08} amount={0.1} />
          </a>
        ))}
      </nav>

      {showCta && (
        <PillButton
          as="a"
          accent
          className={styles.navCta}
          href={ctaHref}
          onClick={onAppCtaClick}
          style={{ filter: undefined }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={ctaLabel}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              style={{ display: 'inline-block' }}
            >
              <StaggerWords text={ctaLabel} baseDelay={0.05} amount={0.1} />
            </motion.span>
          </AnimatePresence>
        </PillButton>
      )}
    </motion.header>
  )
}
