import { Helmet } from 'react-helmet-async'

import { GlassCard } from '@/shared/components/GlassCard'
import { StaggerWords } from '@/shared/components/StaggerWords'
import { useExitNavigation } from '@/shared/hooks/useExitNavigation'
import buttonStyles from '@/shared/components/Button.module.css'
import styles from './ErrorPage.module.css'

export default function ErrorPage() {
  const navigateWithExit = useExitNavigation()

  const handleGoHome = (event: React.MouseEvent<HTMLAnchorElement>) => {
    navigateWithExit(event, '/')
  }

  const handleReload = () => {
    const lastPath = sessionStorage.getItem('last_attempted_path') || '/'
    window.location.assign(lastPath)
  }

  return (
    <div className={styles.appRoot}>
      <Helmet>
        <title>Oops! - CAPY Error</title>
      </Helmet>
      <main className={styles.main}>
        <GlassCard className={styles.errorCard}>
          <div className={styles.errorContent}>
            <span className={styles.errorIcon} role="img" aria-label="warning">
              ⚠️
            </span>
            <h2>
              <StaggerWords text="system interruption" />
            </h2>
            <p>
              <StaggerWords
                text="Something went wrong while loading the CAPY experience. We've logged the error and are working to stabilize the system."
                baseDelay={0.4}
                stagger={0.01}
              />
            </p>

            <div className={styles.actions}>
              <a
                href="/"
                onClick={handleGoHome}
                className={`${buttonStyles.pillButton} ${buttonStyles.accent}`}
              >
                <StaggerWords text="return home" baseDelay={0.6} />
              </a>
              <button
                onClick={handleReload}
                className={`${buttonStyles.pillButton} ${buttonStyles.subtle}`}
              >
                <StaggerWords text="try again" baseDelay={0.7} />
              </button>
            </div>
          </div>
        </GlassCard>
      </main>

      <div className={styles.exitOverlay} aria-hidden="true" />
    </div>
  )
}
