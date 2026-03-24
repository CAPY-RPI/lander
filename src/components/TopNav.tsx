import { motion } from "framer-motion";
import { assets, navItems } from "../data/content";

export function TopNav() {
  return (
    <motion.header
      className="topNav"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <img src={assets.logo} alt="Capy logo" className="brandLogo" />

      <nav aria-label="Primary navigation" className="navPill">
        {navItems.map((item) => (
          <a key={item.label} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>

      <a className="pillButton" href="#launch">
        let&apos;s go
      </a>
    </motion.header>
  );
}
