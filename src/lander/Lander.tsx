import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { TopNav } from '@/shared/components/TopNav'
import { ExitOverlay } from '@/shared/components/ExitOverlay'
import { useHorizontalWheelScroll } from '@/shared/hooks/useHorizontalWheelScroll'
import { usePageTransition } from '@/shared/hooks/usePageTransition'
import { CapyRailSection } from './sections/CapyRailSection'
import { ContactSection } from './sections/ContactSection'
import { FeaturesSection } from './sections/FeaturesSection'
import { HeroSection } from './sections/HeroSection'
import { InterfaceSection } from './sections/InterfaceSection'
import { Helmet } from 'react-helmet-async'
import styles from './Lander.module.css'

const MOBILE_QUERY = '(max-width: 768px)'

/**
 * The main Lander component.
 * Serves as the landing page for capy, featuring scrolling sections and product details.
 * Contains the Hero, Features, Interface, Contact, and Rail sections.
 */
function Lander() {
  const scrollerRef = useRef<HTMLElement | null>(null)
  const disabledRef = useRef<HTMLElement | null>(null)
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches,
  )

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY)
    const handler = (event: MediaQueryListEvent) => setIsMobile(event.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useHorizontalWheelScroll(isMobile ? disabledRef : scrollerRef, { endCutoffPx: 300 })

  usePageTransition()

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
        {isMobile ? (
          <main className={styles.mobileSnapScroller}>
            <HeroSection />
            <FeaturesSection />
            <InterfaceSection />
            <ContactSection />
            <CapyRailSection />
          </main>
        ) : (
          <>
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
          </>
        )}
      </div>
      <ExitOverlay />
    </>
  )
}
export default Lander
