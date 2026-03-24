import { AnimatedPanel } from "../components/AnimatedPanel";
import { StaggerWords } from "../components/StaggerWords";

export function ContactSection() {
  return (
    <AnimatedPanel className="panel contactPanel" staggerIndex={3}>
      <h2>
        <StaggerWords text="say hello" baseDelay={0.1} />
      </h2>
      <p className="contactLead">
        <StaggerWords text="we're capy to hear from you" baseDelay={0.2} />
      </p>
      <a className="emailPill" href="mailto:hello@capyrpi.org">
        <StaggerWords text="hello@capyrpi.org" baseDelay={0.28} />
      </a>
      <p className="contactMeta">
        <StaggerWords text="we're also reachable via discord" baseDelay={0.36} />
      </p>
    </AnimatedPanel>
  );
}
