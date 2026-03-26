import { useRef } from 'react'
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

/**
 * The main Lander component.
 * Serves as the landing page for capy, featuring scrolling sections and product details.
 * Contains the Hero, Features, Interface, Contact, and Rail sections.
 */
function Lander() {
  const scrollerRef = useRef<HTMLElement | null>(null)
  useHorizontalWheelScroll(scrollerRef, { endCutoffPx: 300 })

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
      <ExitOverlay />
    </>
  )
}
export default Lander
