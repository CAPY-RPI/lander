import { AnimatedPanel } from "../components/AnimatedPanel";

export function ContactSection() {
  return (
    <AnimatedPanel className="panel contactPanel" staggerIndex={3}>
      <h2>say hello</h2>
      <p className="contactLead">we&apos;re capy to hear from you</p>
      <a className="emailPill" href="mailto:hello@capyrpi.org">
        hello@capyrpi.org
      </a>
      <p className="contactMeta">we&apos;re also reachable via discord</p>
    </AnimatedPanel>
  );
}
