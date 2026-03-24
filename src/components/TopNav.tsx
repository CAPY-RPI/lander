import { motion } from "framer-motion";
import { StaggerWords } from "./StaggerWords";
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
            <StaggerWords text={item.label} baseDelay={0.08} amount={0.1} />
          </a>
        ))}
      </nav>

      <a className="pillButton accent navCta" href="#launch">
        <StaggerWords text="let's go" baseDelay={0.18} amount={0.1} />
      </a>
    </motion.header>
  );
}
