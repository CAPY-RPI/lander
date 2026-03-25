import { AnimatedPanel } from '../../shared/components/AnimatedPanel'
import { GlassCard } from '../../shared/components/GlassCard'
import { primaryCards } from '../../shared/data/content'
import styles from './FeaturesSection.module.css'

const cardPositions = [
  'card-col1-row1',
  'card-col2-row1',
  'card-col2-row2',
  'card-col1-row2-span2',
  'card-col2-row3',
]

export function FeaturesSection() {
  return (
    <AnimatedPanel className={`panel ${styles.featuresPanel}`} id="features" staggerIndex={1}>
      {primaryCards.map((card, index) => (
        <GlassCard
          key={card.title}
          title={card.title}
          body={card.body}
          className={styles[cardPositions[index]] || ''}
          staggerIndex={index}
        />
      ))}
    </AnimatedPanel>
  )
}
