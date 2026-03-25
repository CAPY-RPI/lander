import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { StaggerWords } from './StaggerWords'
import { useRevealProgress } from '../hooks/useRevealProgress'
import styles from './GlassCard.module.css'

type GlassCardProps = {
  title?: string
  body?: string
  className?: string
  children?: ReactNode
  staggerIndex?: number
}

export function GlassCard({ title, body, className, children, staggerIndex = 0 }: GlassCardProps) {
  const [cardRef, { centerDelta, progress }] = useRevealProgress<HTMLElement>(0.36)
  // Estimate vertical index for stagger based on top offset (optional, can be improved)
  const [verticalIndex, setVerticalIndex] = useState(0)
  useEffect(() => {
    const node = cardRef.current
    if (!node) return
    const rect = node.getBoundingClientRect()
    const verticalStep = 170
    setVerticalIndex(Math.max(0, Math.round(rect.top / verticalStep)))
  }, [cardRef])

  const textBaseDelay = verticalIndex * 0.08 + staggerIndex * 0.02 + 0.06
  const animationDuration = 0.25 // 25% of viewport width per card
  const staggerOffset = staggerIndex * 0.15 // Each card starts 5% later
  const progressStart = staggerOffset
  const progressEnd = progressStart + animationDuration
  const delayedProgress =
    progress < progressStart
      ? 0
      : progress > progressEnd
        ? 1
        : (progress - progressStart) / animationDuration
  const side: 1 | -1 = centerDelta >= 0 ? 1 : -1
  const outX = side * 52
  const style = {
    opacity: delayedProgress,
    x: outX * (1 - delayedProgress),
    y: 8 * (1 - delayedProgress),
    scale: 0.975 + (1 - 0.975) * delayedProgress,
    filter: `blur(${(3 * (1 - delayedProgress)).toFixed(2)}px)`,
  }
  const textInView = delayedProgress > 0.02

  return (
    <motion.article
      ref={cardRef}
      className={`${styles.glassCard} ${className ?? ''}`.trim()}
      style={style}
    >
      {title ? (
        <h3>
          <StaggerWords
            text={title}
            inView={textInView}
            baseDelay={textBaseDelay}
            stagger={0.032}
          />
        </h3>
      ) : null}
      {body ? (
        <p className={styles.glassCardBody}>
          <StaggerWords
            text={body}
            inView={textInView}
            baseDelay={textBaseDelay + 0.12}
            stagger={0.02}
          />
        </p>
      ) : null}
      {children}
    </motion.article>
  )
}
