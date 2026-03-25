import { AnimatedPanel } from '../../shared/components/AnimatedPanel'
import { StaggerWords } from '../../shared/components/StaggerWords'
import styles from './InterfaceSection.module.css'

export function InterfaceSection() {
  return (
    <AnimatedPanel className={`panel ${styles.interfacePanel}`} id="interface" staggerIndex={2}>
      <div className={styles.interfaceContent}>
        <h2>
          <StaggerWords text="imagine our interface is here" baseDelay={0.1} />
        </h2>
        <p className={styles.interfaceSub}>
          <StaggerWords text="(and whatever you do, don't think about ramen)" baseDelay={0.24} />
        </p>
        <p className={styles.interfaceFoot}>
          <StaggerWords text="jokes aside, come back on May 1st" baseDelay={0.36} />
        </p>
      </div>
    </AnimatedPanel>
  )
}
