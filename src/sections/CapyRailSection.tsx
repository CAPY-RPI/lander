import { AnimatedPanel } from "../components/AnimatedPanel";
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
    <AnimatedPanel className="panel capyRailPanel" staggerIndex={4}>
      <div className="verticalMarkWrap" aria-hidden="true">
        <img src={assets.capyVerticalMark} alt="" className="verticalMark" />
      </div>

      <div className="railContent">
        <p className="railTop">experience hibernation</p>

        <div className="railLinks">
          <div className="railLinkBlock">
            <p className="columnTitle">team</p>
            <p>about</p>
            <p>brand</p>
            <p>contribute</p>
          </div>

          <div className="railLinkRow">
            <div className="railLinkBlock">
              <p className="columnTitle">resources</p>
              <p>support</p>
              <p>developers</p>
              <p>feedback</p>
            </div>
            <div className="railLinkBlock">
              <p className="columnTitle">policies</p>
              <p>terms</p>
              <p>privacy</p>
            </div>
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
      </div>
    </AnimatedPanel>
  );
}
