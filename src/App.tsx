import { useRef } from "react";
import { motion } from "framer-motion";
import { TopNav } from "./components/TopNav";
import { useHorizontalWheelScroll } from "./hooks/useHorizontalWheelScroll";
import { CapyRailSection } from "./sections/CapyRailSection";
import { ContactSection } from "./sections/ContactSection";
import { FeaturesSection } from "./sections/FeaturesSection";
import { HeroSection } from "./sections/HeroSection";
import { InterfaceSection } from "./sections/InterfaceSection";
import "./App.css";

function App() {
  const scrollerRef = useRef<HTMLElement | null>(null);
  useHorizontalWheelScroll(scrollerRef, { endCutoffPx: 220 });

  return (
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
  );
}

export default App;
