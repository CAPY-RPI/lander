import { Helmet } from 'react-helmet-async'

import { GlassCard } from '@/shared/components/GlassCard'
import { StaggerWords } from '@/shared/components/StaggerWords'
import { useExitNavigation } from '@/shared/hooks/useExitNavigation'
import { usePageTransition } from '@/shared/hooks/usePageTransition'
import { PillButton } from '@/shared/components/PillButton'
import { ExitOverlay } from '@/shared/components/ExitOverlay'
import styles from './ErrorPage.module.css'

export default function ErrorPage() {
  const navigateWithExit = useExitNavigation()
  usePageTransition()

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
              <PillButton as="a" href="/" accent onClick={handleGoHome}>
                <StaggerWords text="return home" baseDelay={0.6} />
              </PillButton>
              <PillButton onClick={handleReload} subtle>
                <StaggerWords text="try again" baseDelay={0.7} />
              </PillButton>
            </div>
          </div>
        </GlassCard>
      </main>

      <ExitOverlay />
    </div>
  )
}
