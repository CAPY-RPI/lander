import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { CreateOrgModal } from '@/app/components/CreateOrgModal'
import { AppSearchModal } from '@/app/components/AppSearchModal'
import { AppTopNav } from '@/app/components/AppTopNav'
import { CreateEventModal } from '@/app/components/CreateEventModal'
import { ExitOverlay } from '@/shared/components/ExitOverlay'
import { useHorizontalWheelScroll } from '@/shared/hooks/useHorizontalWheelScroll'
import { usePageTransition } from '@/shared/hooks/usePageTransition'

import { HomeSection } from './sections/HomeSection'
import { ProfileSection } from './sections/ProfileSection'
import { EventsSection } from './sections/EventsSection'
import { OrgsSection } from './sections/OrgsSection'
import styles from './App.module.css'

const easeInOutQuart = (t: number) =>
  t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2

/**
 * The main App component (/app).
 * Features a horizontally scrolling scaffold with snapping pages.
 */
export default function AppMain() {
  const scrollerRef = useRef<HTMLElement | null>(null)
  const scrollRafRef = useRef<number | null>(null)
  const releaseSnapTimerRef = useRef<number | null>(null)
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false)
  const [isCreateOrgOpen, setIsCreateOrgOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchSessionKey, setSearchSessionKey] = useState(0)
  const [eventsRefreshKey, setEventsRefreshKey] = useState(0)
  const [organizationsRefreshKey, setOrganizationsRefreshKey] = useState(0)
  useHorizontalWheelScroll(scrollerRef, { endCutoffPx: 0 })

  usePageTransition()

  useEffect(() => {
    // Initial scroll to home (since it's now second in the list)
    setTimeout(() => {
      const homeSection = document.getElementById('home')
      if (homeSection && scrollerRef.current) {
        scrollerRef.current.scrollLeft = homeSection.offsetLeft
      }
    }, 10)

    return () => {
      if (scrollRafRef.current != null) {
        window.cancelAnimationFrame(scrollRafRef.current)
      }
      if (releaseSnapTimerRef.current != null) {
        window.clearTimeout(releaseSnapTimerRef.current)
      }
    }
  }, [])

  const scrollSectionIntoView = (section: HTMLElement) => {
    const scroller = scrollerRef.current
    if (!scroller) return

    const scrollerRect = scroller.getBoundingClientRect()
    const sectionRect = section.getBoundingClientRect()
    const sectionCenter =
      scroller.scrollLeft + (sectionRect.left - scrollerRect.left) + sectionRect.width / 2
    const rawLeft = sectionCenter - scroller.clientWidth / 2
    const maxLeft = Math.max(0, scroller.scrollWidth - scroller.clientWidth)
    const targetLeft = Math.max(0, Math.min(rawLeft, maxLeft))
    const startLeft = scroller.scrollLeft
    const distance = targetLeft - startLeft

    if (Math.abs(distance) < 1) {
      scroller.scrollLeft = targetLeft
      return
    }

    if (scrollRafRef.current != null) {
      window.cancelAnimationFrame(scrollRafRef.current)
      scrollRafRef.current = null
    }

    if (releaseSnapTimerRef.current != null) {
      window.clearTimeout(releaseSnapTimerRef.current)
    }

    scroller.style.scrollSnapType = 'none'

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
      scrollRafRef.current = null
    }

    releaseSnapTimerRef.current = window.setTimeout(() => {
      if (scrollRafRef.current != null) {
        window.cancelAnimationFrame(scrollRafRef.current)
        scrollRafRef.current = null
      }
      scroller.style.scrollSnapType = ''
    }, durationMs + 120)

    scrollRafRef.current = window.requestAnimationFrame(tick)
  }

  const handleSearchSelect = (key: string) => {
    setIsSearchOpen(false)

    const target = document.querySelector<HTMLElement>(`[data-search-key="${key}"]`)
    if (!target) return

    const targetSectionId = target.dataset.searchSection
    const targetSection = targetSectionId
      ? document.getElementById(targetSectionId)
      : target.closest('.panel')

    if (targetSection instanceof HTMLElement) {
      scrollSectionIntoView(targetSection)
    }

    const activateTarget = () => {
      if (target.dataset.searchAction === 'focus') {
        target.focus({ preventScroll: true })
        return
      }

      if (target.dataset.searchAction === 'click') {
        if (target.closest('[data-native-horizontal-scroll]')) {
          target.scrollIntoView({
            behavior: 'smooth',
            inline: 'center',
            block: 'nearest',
          })
          window.setTimeout(() => {
            target.click()
          }, 220)
          return
        }

        target.click()
        return
      }

      target.focus?.({ preventScroll: true })
    }

    window.setTimeout(activateTarget, 340)
  }

  return (
    <>
      <Helmet>
        <title>CAPY - Dashboard</title>
        <meta name="description" content="Your campus life dashboard." />
      </Helmet>

      <div className={styles.appRoot}>
        <AppTopNav
          onOpenSearch={() => {
            setSearchSessionKey((current) => current + 1)
            setIsSearchOpen(true)
          }}
        />

        <main className={styles.horizontalScroller} ref={scrollerRef} id="scroller">
          <motion.div
            className={styles.panelTrack}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <ProfileSection />
            <HomeSection />
            <EventsSection
              refreshKey={eventsRefreshKey}
              onCreateEvent={() => setIsCreateEventOpen(true)}
              onEventsChanged={() => setEventsRefreshKey((current) => current + 1)}
            />
            <OrgsSection
              refreshKey={organizationsRefreshKey}
              onCreateOrganization={() => setIsCreateOrgOpen(true)}
              onOrganizationsChanged={() => setOrganizationsRefreshKey((current) => current + 1)}
            />
          </motion.div>
        </main>
      </div>
      <CreateEventModal
        isOpen={isCreateEventOpen}
        onClose={() => setIsCreateEventOpen(false)}
        onCreated={() => {
          setEventsRefreshKey((current) => current + 1)
          setIsCreateEventOpen(false)
        }}
      />
      <CreateOrgModal
        isOpen={isCreateOrgOpen}
        onClose={() => setIsCreateOrgOpen(false)}
        onCreated={() => {
          setOrganizationsRefreshKey((current) => current + 1)
          setIsCreateOrgOpen(false)
        }}
      />
      <AppSearchModal
        key={searchSessionKey}
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelect={handleSearchSelect}
      />
      <ExitOverlay />
    </>
  )
}
