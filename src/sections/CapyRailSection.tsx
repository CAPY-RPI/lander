import { motion } from "framer-motion";
import { AspectImage } from "../components/AspectImage";
import { assets } from "../data/content";

const socialAssets = [
  { src: assets.x, alt: "X" },
  { src: assets.instagram, alt: "Instagram" },
  { src: assets.facebook, alt: "Facebook" },
  { src: assets.github, alt: "GitHub" },
  { src: assets.tiktok, alt: "TikTok" },
  { src: assets.youtube, alt: "YouTube" },
];

export function CapyRailSection() {
  return (
    <motion.section
      className="panel capyRailPanel"
      initial={{ opacity: 0, x: 24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ amount: 0.25, once: true }}
      transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className="railTop">experience hibernation</p>

      <div className="verticalMarkWrap" aria-hidden="true">
        <AspectImage src={assets.capyVerticalMark} alt="" className="verticalMark" />
      </div>

      <div className="railColumns">
        <div>
          <p className="columnTitle">team</p>
          <p>about</p>
          <p>brand</p>
          <p>contribute</p>
        </div>
        <div>
          <p className="columnTitle">resources</p>
          <p>support</p>
          <p>developers</p>
          <p>feedback</p>
        </div>
        <div>
          <p className="columnTitle">policies</p>
          <p>terms</p>
          <p>privacy</p>
        </div>
      </div>

      <div className="railSocial">
        <p>social</p>
        <div>
          {socialAssets.map((item) => (
            <a href="#" key={item.alt} aria-label={item.alt}>
              <AspectImage src={item.src} alt={item.alt} />
            </a>
          ))}
        </div>
      </div>

      <p className="railStatus">all systems operational</p>
      <p className="railFoot">capywrite 2026 // all rights reserved</p>
    </motion.section>
  );
}
