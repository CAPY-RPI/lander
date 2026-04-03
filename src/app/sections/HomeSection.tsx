import { AnimatedPanel } from '@/shared/components/AnimatedPanel'
import styles from './HomeSection.module.css'

export function HomeSection() {
  return (
    <AnimatedPanel
      className={`panel ${styles.homePanel}`}
      id="home"
      staggerIndex={0}
      data-search-key="section:home"
      data-search-label="home"
      data-search-category="section"
      data-search-description="dashboard home overview"
      data-search-keywords="welcome campus life dashboard"
    >
      <div className={styles.content}>
        <h1 className={styles.title}>home</h1>
        <p className={styles.description}>
          Welcome to your campus life, simplified. Everything you need is just a scroll away.
        </p>
      </div>
    </AnimatedPanel>
  )
}
