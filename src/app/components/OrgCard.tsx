import { motion } from 'framer-motion'
import type { AppOrganization } from '@/app/data/organizations'
import { StaggerWords } from '@/shared/components/StaggerWords'
import { useRevealProgress } from '@/shared/hooks/useRevealProgress'
import styles from './OrgCard.module.css'

type OrgCardProps = {
  organization: AppOrganization
  onSelect?: (organization: AppOrganization) => void
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return 'Unknown'
  }

  return dateFormatter.format(date)
}

function getDescription(organization: AppOrganization) {
  if (organization.isMember) {
    return 'Already in the loop. Open the org to check members, events, and manage your seat.'
  }

  return 'Browse the org snapshot, see what it is running, and join without leaving the dashboard.'
}

export function OrgCard({ organization, onSelect }: OrgCardProps) {
  const [cardRef, { centerDelta, progress }] = useRevealProgress<HTMLButtonElement>(0.45)
  const delayedProgress = Math.min(1, Math.max(0, progress))
  const side: 1 | -1 = centerDelta >= 0 ? 1 : -1
  const outX = side * 48
  const textInView = delayedProgress > 0.06
  const style = {
    opacity: delayedProgress,
    x: outX * (1 - delayedProgress),
    y: 10 * (1 - delayedProgress),
    scale: 0.97 + (1 - 0.97) * delayedProgress,
    filter: `blur(${(3 * (1 - delayedProgress)).toFixed(2)}px)`,
  }

  return (
    <motion.button
      ref={cardRef}
      type="button"
      className={styles.orgCard}
      style={style}
      onClick={() => onSelect?.(organization)}
      aria-label={`Open details for ${organization.name}`}
    >
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>
          <StaggerWords
            text={organization.name}
            inView={textInView}
            baseDelay={0.05}
            stagger={0.03}
          />
        </h3>
        <p className={styles.cardDescription}>
          <StaggerWords
            text={getDescription(organization)}
            inView={textInView}
            baseDelay={0.12}
            stagger={0.018}
          />
        </p>
      </div>

      <dl className={styles.metaList}>
        <div className={styles.metaRow}>
          <dt>Status</dt>
          <dd>
            <StaggerWords
              text={organization.isMember ? 'Joined' : 'Open to join'}
              inView={textInView}
              baseDelay={0.18}
              stagger={0.022}
            />
          </dd>
        </div>
        <div className={styles.metaRow}>
          <dt>Created</dt>
          <dd>
            <StaggerWords
              text={formatDate(organization.date_created)}
              inView={textInView}
              baseDelay={0.22}
              stagger={0.02}
            />
          </dd>
        </div>
      </dl>
    </motion.button>
  )
}
