import { AnimatedPanel } from '../components/AnimatedPanel'
import { AspectImage } from '../components/AspectImage'
import { StaggerWords } from '../components/StaggerWords'
import { TypewriterWord } from '../components/TypewriterWord'
import { assets } from '../data/content'

const socialAssets = [
  { src: assets.x, alt: 'X' },
  { src: assets.instagram, alt: 'Instagram' },
  { src: assets.facebook, alt: 'Facebook' },
  { src: assets.github, alt: 'GitHub' },
  { src: assets.tiktok, alt: 'TikTok' },
  { src: assets.youtube, alt: 'YouTube' },
]

export function CapyRailSection() {
  return (
    <AnimatedPanel className="panel capyRailPanel" id="more" staggerIndex={4}>
      <div className="verticalMarkWrap" aria-hidden="true">
        <img src={assets.capyVerticalMark} alt="" className="verticalMark" />
      </div>

      <div className="railContent">
        <p className="railTop">
          <StaggerWords text="experience" baseDelay={0.08} />{' '}
          <TypewriterWord words={['hibernation', 'frictionlessness', 'community']} />
        </p>

        <div className="railLinks">
          <div className="railLinkBlock">
            <p className="columnTitle">
              <StaggerWords text="team" baseDelay={0.15} />
            </p>
            <p>
              <StaggerWords text="about" baseDelay={0.17} />
            </p>
            <p>
              <StaggerWords text="brand" baseDelay={0.19} />
            </p>
            <p>
              <StaggerWords text="contribute" baseDelay={0.21} />
            </p>
          </div>

          <div className="railLinkRow">
            <div className="railLinkBlock">
              <p className="columnTitle">
                <StaggerWords text="resources" baseDelay={0.24} />
              </p>
              <p>
                <StaggerWords text="support" baseDelay={0.26} />
              </p>
              <p>
                <StaggerWords text="developers" baseDelay={0.28} />
              </p>
              <p>
                <StaggerWords text="feedback" baseDelay={0.3} />
              </p>
            </div>
            <div className="railLinkBlock">
              <p className="columnTitle">
                <StaggerWords text="policies" baseDelay={0.32} />
              </p>
              <p>
                <StaggerWords text="terms" baseDelay={0.34} />
              </p>
              <p>
                <StaggerWords text="privacy" baseDelay={0.36} />
              </p>
            </div>
          </div>
        </div>

        <div className="railMeta">
          <div className="railSocial">
            <p>
              <StaggerWords text="social" baseDelay={0.38} />
            </p>
            <div>
              {socialAssets.map((item) => (
                <a href="#" key={item.alt} aria-label={item.alt}>
                  <AspectImage src={item.src} alt={item.alt} />
                </a>
              ))}
            </div>
          </div>
          <p className="railStatus">
            <StaggerWords text="all systems operational" baseDelay={0.42} />
          </p>
          <p className="railFoot">
            <StaggerWords text="capywrite 2026 // all rights reserved" baseDelay={0.46} />
          </p>
        </div>
      </div>
    </AnimatedPanel>
  )
}
