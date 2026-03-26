import { AnimatedPanel } from '@/shared/components/AnimatedPanel'
import styles from './OrgsSection.module.css'

export function OrgsSection() {
  return (
    <AnimatedPanel className={`panel ${styles.orgsPanel}`} id="orgs" staggerIndex={3}>
      <div>
        <h1 className={styles.title}>organizations</h1>
        <p>Connect with student clubs and groups. Find your next move in your sleep.</p>
      </div>
    </AnimatedPanel>
  )
}
