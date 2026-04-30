import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SearchIcon } from '@/shared/components/icons/SearchIcon'
import styles from './AppSearchModal.module.css'

type SearchTarget = {
  key: string
  label: string
  description: string
  category: string
  keywords: string
}

type AppSearchModalProps = {
  isOpen: boolean
  onClose: () => void
  onSelect: (key: string) => void
}

function readSearchTargets(): SearchTarget[] {
  const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-search-key]'))

  const targets = elements
    .map((element) => {
      const key = element.dataset.searchKey?.trim()
      const label = element.dataset.searchLabel?.trim()
      if (!key || !label) return null

      return {
        key,
        label,
        description: element.dataset.searchDescription?.trim() ?? '',
        category: element.dataset.searchCategory?.trim() ?? 'item',
        keywords: element.dataset.searchKeywords?.trim() ?? '',
      }
    })
    .filter((target): target is SearchTarget => target != null)

  const deduped = new Map<string, SearchTarget>()
  for (const target of targets) {
    if (!deduped.has(target.key)) {
      deduped.set(target.key, target)
    }
  }

  return Array.from(deduped.values())
}

export function AppSearchModal({ isOpen, onClose, onSelect }: AppSearchModalProps) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [targets] = useState<SearchTarget[]>(() => readSearchTargets())
  const inputRef = useRef<HTMLInputElement | null>(null)
  const deferredQuery = useDeferredValue(query)
  const normalizedQuery = deferredQuery.trim().toLowerCase()
  const isSearching = normalizedQuery.length > 0

  useEffect(() => {
    if (!isOpen) return

    const focusTimer = window.setTimeout(() => {
      inputRef.current?.focus()
      inputRef.current?.select()
    }, 40)

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.clearTimeout(focusTimer)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen, onClose])

  const filteredTargets = useMemo(() => {
    if (!normalizedQuery) {
      return targets.slice(0, 3)
    }

    const queryTerms = normalizedQuery.split(/\s+/)

    return targets
      .map((target) => {
        const haystack = [
          target.label.toLowerCase(),
          target.description.toLowerCase(),
          target.category.toLowerCase(),
          target.keywords.toLowerCase(),
        ].join(' ')

        let score = 0
        for (const term of queryTerms) {
          if (target.label.toLowerCase().startsWith(term)) score += 8
          if (target.label.toLowerCase().includes(term)) score += 5
          if (target.description.toLowerCase().includes(term)) score += 2
          if (target.category.toLowerCase().includes(term)) score += 1
          if (target.keywords.toLowerCase().includes(term)) score += 1
          if (!haystack.includes(term)) score -= 20
        }

        return { target, score }
      })
      .filter((entry) => entry.score > 0)
      .sort(
        (left, right) =>
          right.score - left.score || left.target.label.localeCompare(right.target.label),
      )
      .slice(0, 12)
      .map((entry) => entry.target)
  }, [normalizedQuery, targets])

  const activeSelectedIndex =
    filteredTargets.length === 0 ? 0 : Math.min(selectedIndex, filteredTargets.length - 1)

  if (!isOpen) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        className={styles.overlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            onClose()
          }
        }}
      >
        <motion.div
          className={styles.popup}
          role="dialog"
          aria-modal="true"
          aria-labelledby="app-search-title"
          initial={{ opacity: 0, y: -18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.985 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          onMouseDown={(event) => event.stopPropagation()}
        >
          <div className={styles.header}>
            <div className={styles.searchIcon} aria-hidden="true">
              <SearchIcon className={styles.searchGlyph} />
            </div>
            <div className={styles.headerText}>
              <h2 id="app-search-title" className={styles.title}>
                search
              </h2>
              <p className={styles.subtitle}>sections, profile fields, events, and orgs</p>
            </div>
          </div>

          <input
            ref={inputRef}
            type="search"
            className={styles.input}
            placeholder="Search the dashboard"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setSelectedIndex(0)
            }}
            onKeyDown={(event) => {
              if (event.key === 'ArrowDown') {
                event.preventDefault()
                setSelectedIndex((current) => {
                  if (filteredTargets.length === 0) return 0
                  return Math.min(current + 1, filteredTargets.length - 1)
                })
                return
              }

              if (event.key === 'ArrowUp') {
                event.preventDefault()
                setSelectedIndex((current) => Math.max(current - 1, 0))
                return
              }

              if (event.key === 'Enter') {
                event.preventDefault()
                const selectedTarget = filteredTargets[activeSelectedIndex]
                if (selectedTarget) {
                  onSelect(selectedTarget.key)
                }
              }
            }}
          />

          <div
            className={`${styles.results} ${isSearching ? styles.resultsExpanded : styles.resultsCompact}`}
            role="listbox"
            aria-label="Search results"
          >
            {filteredTargets.length > 0 ? (
              filteredTargets.map((target, index) => (
                <button
                  key={target.key}
                  type="button"
                  className={`${styles.resultButton} ${index === activeSelectedIndex ? styles.isSelected : ''}`}
                  onMouseEnter={() => setSelectedIndex(index)}
                  onClick={() => onSelect(target.key)}
                >
                  <span className={styles.resultMeta}>{target.category}</span>
                  <strong className={styles.resultLabel}>{target.label}</strong>
                  {target.description ? (
                    <span className={styles.resultDescription}>{target.description}</span>
                  ) : null}
                </button>
              ))
            ) : (
              <div className={styles.emptyState}>No matching items found.</div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
