import { motion } from "framer-motion";
import { AspectImage } from "../components/AspectImage";
import { assets } from "../data/content";

export function HeroSection() {
  return (
    <section className="panel heroPanel" id="launch">
      <div className="heroCopy">
        <h1>
          <span>more sleep</span>
          <span>for you</span>
        </h1>
        <p>
          your campus life, simplified. find your community, track your impact, and discover
          opportunities. built by students, for students.
        </p>
        <div className="heroCtas">
          <a className="pillButton accent" href="#features">
            absolutely
          </a>
          <a className="pillButton subtle" href="#features">
            how
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
    </section>
  );
}
