import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useRevealProgress } from '../hooks/useRevealProgress'

type AnimatedPanelProps = {
  className: string
  id?: string
  children: ReactNode
  staggerIndex?: number
  'data-search-key'?: string
  'data-search-label'?: string
  'data-search-category'?: string
  'data-search-description'?: string
  'data-search-keywords'?: string
}

export function AnimatedPanel({
  className,
  id,
  children,
  staggerIndex = 0,
  'data-search-key': dataSearchKey,
  'data-search-label': dataSearchLabel,
  'data-search-category': dataSearchCategory,
  'data-search-description': dataSearchDescription,
  'data-search-keywords': dataSearchKeywords,
}: AnimatedPanelProps) {
  const [panelRef, { centerDelta, progress }] = useRevealProgress<HTMLElement>(0.3)
  const progressOffset = Math.min(0.92, staggerIndex * 0.085)
  const delayedProgress =
    progress <= progressOffset ? 0 : (progress - progressOffset) / (1 - progressOffset)
  const side: 1 | -1 = centerDelta >= 0 ? 1 : -1
  const outX = side * 84
  const style = {
    opacity: delayedProgress,
    x: outX * (1 - delayedProgress),
    y: 10 * (1 - delayedProgress),
    scale: 0.965 + (1 - 0.965) * delayedProgress,
    filter: `blur(${(4 * (1 - delayedProgress)).toFixed(2)}px)`,
  }

  return (
    <motion.section
      ref={panelRef}
      id={id}
      className={className}
      style={style}
      data-search-key={dataSearchKey}
      data-search-label={dataSearchLabel}
      data-search-category={dataSearchCategory}
      data-search-description={dataSearchDescription}
      data-search-keywords={dataSearchKeywords}
    >
      {children}
    </motion.section>
  )
}
