import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import styles from './TypewriterWord.module.css'

type TypewriterWordProps = {
  words: string[]
  className?: string
  typingSpeed?: number
  deletingSpeed?: number
  holdMs?: number
}

export function TypewriterWord({
  words,
  className,
  typingSpeed = 84,
  deletingSpeed = 52,
  holdMs = 980,
}: TypewriterWordProps) {
  const safeWords = useMemo(() => words.filter(Boolean), [words])
  const [wordIndex, setWordIndex] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (safeWords.length === 0) return

    const activeWord = safeWords[wordIndex % safeWords.length]

    const atWordEnd = !isDeleting && charCount === activeWord.length
    const atWordStart = isDeleting && charCount === 0
    const stepDelay = atWordEnd ? holdMs : isDeleting ? deletingSpeed : typingSpeed

    const stepTimer = setTimeout(() => {
      if (atWordEnd) {
        setIsDeleting(true)
        return
      }

      if (atWordStart) {
        setIsDeleting(false)
        setWordIndex((prev) => (prev + 1) % safeWords.length)
        return
      }

      setCharCount((prev) => prev + (isDeleting ? -1 : 1))
    }, stepDelay)

    return () => clearTimeout(stepTimer)
  }, [charCount, deletingSpeed, holdMs, isDeleting, safeWords, typingSpeed, wordIndex])

  const displayWord =
    safeWords.length > 0 ? safeWords[wordIndex % safeWords.length].slice(0, charCount) : ''

  return (
    <span className={`${styles.typewriterWrap} ${className ?? ''}`.trim()}>
      <span>{displayWord}</span>
      <motion.span
        className={styles.typewriterCaret}
        aria-hidden="true"
        animate={{ opacity: [0.2, 1, 0.2] }}
        transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
      >
        |
      </motion.span>
    </span>
  )
}
