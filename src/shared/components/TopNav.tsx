import { useRef } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { StaggerWords } from './StaggerWords'
import { assets, navItems } from '../data/content'
import { useExitNavigation } from '../hooks/useExitNavigation'
import { useNavScrollSync } from '../hooks/useNavScrollSync'
import { useNavBubbleDrag } from '../hooks/useNavBubbleDrag'
import { PillButton } from './PillButton'
import styles from './TopNav.module.css'

interface TopNavProps {
  items?: typeof navItems
  showCta?: boolean
  ctaLabel?: string
  ctaHref?: string
  onCtaClickOverride?: (event: ReactMouseEvent<HTMLAnchorElement>) => void
}

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

  const {
    activeHref,
    setActiveHref,
    bubbleX,
    bubbleWidth,
    bubbleReady,
    navigateToHref,
    getNavSnapCandidates,
    mapBubbleXToScrollLeft,
    scrollControl,
  } = useNavScrollSync(items, linkRefs, navRef)

  const { dragBubbleX, bubbleDragging, onNavPointerDownCapture } = useNavBubbleDrag({
    items,
    navRef,
    bubbleX,
    bubbleWidth,
    navigateToHref,
    setActiveHref,
    getNavSnapCandidates,
    mapBubbleXToScrollLeft,
    scrollControl,
  })

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
        <PillButton as="a" accent className={styles.navCta} href={ctaHref} onClick={onAppCtaClick}>
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
