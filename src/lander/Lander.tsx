import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TopNav } from '@/shared/components/TopNav'
import { useHorizontalWheelScroll } from '@/shared/hooks/useHorizontalWheelScroll'
import { CapyRailSection } from './sections/CapyRailSection'
import { ContactSection } from './sections/ContactSection'
import { FeaturesSection } from './sections/FeaturesSection'
import { HeroSection } from './sections/HeroSection'
import { InterfaceSection } from './sections/InterfaceSection'
import { Helmet } from 'react-helmet-async'
import styles from './Lander.module.css'

/**
 * The main Lander component.
 * Serves as the landing page for capy, featuring scrolling sections and product details.
 * Contains the Hero, Features, Interface, Contact, and Rail sections.
 */
function Lander() {
  const scrollerRef = useRef<HTMLElement | null>(null)
  useHorizontalWheelScroll(scrollerRef, { endCutoffPx: 300 })

  // Remove 'is-exiting' class from body on mount (prevents overlay persisting on back navigation)
  useEffect(() => {
    // Remove 'is-exiting' on mount
    document.body.classList.remove('is-exiting')

    // Animate fading back if page is restored from bfcache (back/forward navigation)
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        document.body.classList.remove('is-exiting')
        document.body.classList.add('fading-back')
        setTimeout(() => {
          document.body.classList.remove('fading-back')
        }, 350) // match fade duration in CSS
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
        <title>CAPY - Campus Life, Simplified</title>
        <meta
          name="description"
          content="Find your community, track your impact, and discover built by students tools."
        />
      </Helmet>
      <div className={styles.appRoot}>
        <TopNav />

        <main className={styles.horizontalScroller} ref={scrollerRef} id="scroller">
          <motion.div
            className={styles.panelTrack}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <HeroSection />
            <FeaturesSection />
            <InterfaceSection />
            <ContactSection />
            <CapyRailSection />
          </motion.div>
        </main>
      </div>
      {/* Exit overlay for seamless background */}
      <div className={styles.exitOverlay} aria-hidden="true" />
    </>
  )
}
export default Lander
