import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { AppTopNav } from '@/app/components/AppTopNav'
import { useHorizontalWheelScroll } from '@/shared/hooks/useHorizontalWheelScroll'

import { HomeSection } from './sections/HomeSection'
import { ProfileSection } from './sections/ProfileSection'
import { EventsSection } from './sections/EventsSection'
import { OrgsSection } from './sections/OrgsSection'
import styles from './App.module.css'

/**
 * The main App component (/app).
 * Features a horizontally scrolling scaffold with snapping pages.
 */
export default function AppMain() {
  const scrollerRef = useRef<HTMLElement | null>(null)
  useHorizontalWheelScroll(scrollerRef, { endCutoffPx: 0, snap: true })

  useEffect(() => {
    // Remove 'is-exiting' on mount
    document.body.classList.remove('is-exiting')

    // Initial scroll to home (since it's now second in the list)
    setTimeout(() => {
      const homeSection = document.getElementById('home')
      if (homeSection && scrollerRef.current) {
        scrollerRef.current.scrollLeft = homeSection.offsetLeft
      }
    }, 10)

    // Animate fading back if page is restored from bfcache
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        document.body.classList.remove('is-exiting')
      }
    }
    window.addEventListener('pageshow', handlePageShow)
    return () => {
      window.removeEventListener('pageshow', handlePageShow)
    }
  }, [])

  return (
    <>
      <Helmet>
        <title>CAPY - Dashboard</title>
        <meta name="description" content="Your campus life dashboard." />
      </Helmet>

      <div className={styles.appRoot}>
        <AppTopNav />

        <main className={styles.horizontalScroller} ref={scrollerRef} id="scroller">
          <motion.div
            className={styles.panelTrack}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <ProfileSection />
            <HomeSection />
            <EventsSection />
            <OrgsSection />
          </motion.div>
        </main>
      </div>
      {/* Exit overlay for seamless background */}
      <div className={styles.exitOverlay} aria-hidden="true" />
    </>
  )
}
