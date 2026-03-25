import { AnimatedPanel } from '../../shared/components/AnimatedPanel'
import { StaggerWords } from '../../shared/components/StaggerWords'
import styles from './ContactSection.module.css'

export function ContactSection() {
  return (
    <AnimatedPanel className={`panel ${styles.contactPanel}`} id="contact" staggerIndex={3}>
      <div className={styles.contactContent}>
        <div className={styles.contactPrimary}>
          <h2>
            <StaggerWords text="say hello" baseDelay={0.1} />
          </h2>
          <p className={styles.contactLead}>
            <StaggerWords text="we're capy to hear from you" baseDelay={0.2} />
          </p>
          <a className={styles.emailPill} href="mailto:hello@capyrpi.org">
            <StaggerWords text="hello@capyrpi.org" baseDelay={0.28} />
          </a>
        </div>
        <p className={styles.contactMeta}>
          <StaggerWords text="we're also reachable via discord" baseDelay={0.36} />
        </p>
      </div>
    </AnimatedPanel>
  )
}
