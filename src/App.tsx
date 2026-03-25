import { useRef } from 'react'
import { motion } from 'framer-motion'
import { TopNav } from './components/TopNav'
import { useHorizontalWheelScroll } from './hooks/useHorizontalWheelScroll'
import { CapyRailSection } from './sections/CapyRailSection'
import { ContactSection } from './sections/ContactSection'
import { FeaturesSection } from './sections/FeaturesSection'
import { HeroSection } from './sections/HeroSection'
import { InterfaceSection } from './sections/InterfaceSection'
import './App.css'

function App() {
  const scrollerRef = useRef<HTMLElement | null>(null)
  useHorizontalWheelScroll(scrollerRef, { endCutoffPx: 300 })

  // Show exit overlay if body has is-exiting class
  // This is a simple approach using a stateful check, but since the overlay is purely visual and global, we can use a CSS selector only
  return (
    <>
      <div className="appRoot">
        <TopNav />

        <main className="horizontalScroller" ref={scrollerRef}>
          <motion.div
            className="panelTrack"
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
      <div className="exitOverlay" aria-hidden="true" />
    </>
  )
}

export default App
