import { motion } from "framer-motion";
import { AnimatedPanel } from "../components/AnimatedPanel";
import { AspectImage } from "../components/AspectImage";
import { StaggerWords } from "../components/StaggerWords";
import { TypewriterWord } from "../components/TypewriterWord";
import { assets } from "../data/content";

export function HeroSection() {
  return (
    <AnimatedPanel className="panel heroPanel" id="launch" staggerIndex={0}>
      <div className="heroCopy">
        <h1>
          <span>
            more <TypewriterWord words={["sleep", "growth", "fun"]} />
          </span>
          <span>
            <StaggerWords text="for you" baseDelay={0.12} />
          </span>
        </h1>
        <p>
          <StaggerWords
            text="your campus life, simplified. find your community, track your impact, and discover opportunities. built by students, for students."
            baseDelay={0.2}
            stagger={0.018}
          />
        </p>
        <div className="heroCtas">
          <a className="pillButton accent" href="#features">
            <StaggerWords text="absolutely" baseDelay={0.28} />
          </a>
          <a className="pillButton subtle" href="#features">
            <StaggerWords text="how" baseDelay={0.34} />
          </a>
        </div>
      </div>

      <motion.div
        className="heroCampusArt"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.4, once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <AspectImage src={assets.campusArt} alt="Capy campus illustration" />
      </motion.div>
    </AnimatedPanel>
  );
}
