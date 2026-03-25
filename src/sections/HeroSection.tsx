import { AnimatedPanel } from "../components/AnimatedPanel";
import { StaggerWords } from "../components/StaggerWords";
import { TypewriterWord } from "../components/TypewriterWord";

export function HeroSection() {
  return (
    <AnimatedPanel className="panel heroPanel" id="launch" staggerIndex={0}>
      <div className="heroRows">
        <div className="heroRowTitle">
          <h1>
            <span>
              more <TypewriterWord words={["sleep", "growth", "fun"]} />
            </span>
            <span>
              <StaggerWords text="for you" baseDelay={0.12} />
            </span>
          </h1>
        </div>
        <div className="heroRowBottom">
          <div className="heroDescription">
            <p>
              <StaggerWords
                text="your campus life, simplified."
                baseDelay={0.2}
                stagger={0.018}
              />
            </p>
            <p>
              <StaggerWords
                text="find your community, track your impact, and discover opportunities."
                baseDelay={0.28}
                stagger={0.018}
              />
            </p>
            <p>
              <StaggerWords
                text="built by students, for students."
                baseDelay={0.36}
                stagger={0.018}
              />
            </p>
          </div>
          <div className="heroCtas">
            <a className="pillButton accent" href="#features">
              <StaggerWords text="absolutely" baseDelay={0.28} />
            </a>
            <a className="pillButton subtle" href="#features">
              <StaggerWords text="how" baseDelay={0.34} />
            </a>
          </div>
        </div>
      </div>
    </AnimatedPanel>
  );
}
