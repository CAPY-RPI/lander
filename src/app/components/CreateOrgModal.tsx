import { useEffect, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { PillButton } from '@/shared/components/PillButton'
import { useAuth } from '@/shared/context/AuthContext'
import { createOrganization } from '@/shared/services/organizationService'
import styles from './CreateOrgModal.module.css'

type CreateOrgModalProps = {
  isOpen: boolean
  onClose: () => void
  onCreated: () => void
}

/**
 * Dedicated modal for creating an organization from the dashboard.
 */
export function CreateOrgModal({ isOpen, onClose, onCreated }: CreateOrgModalProps) {
  const { isAuthed, isLoading: isAuthLoading, login } = useAuth()
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) {
      setName('')
      setIsSubmitting(false)
      setError(null)
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isSubmitting) {
        onClose()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen, isSubmitting, onClose])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isAuthed) {
      login()
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await createOrganization({ name: name.trim() })
      onCreated()
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : 'Could not create organization.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className={styles.overlay}
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => {
            if (!isSubmitting) {
              onClose()
            }
          }}
        >
          <motion.div
            className={styles.dialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-org-title"
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.header}>
              <div>
                <p className={styles.eyebrow}>new organization</p>
                <h2 className={styles.title} id="create-org-title">
                  create an org
                </h2>
              </div>
              <button
                type="button"
                className={styles.closeButton}
                onClick={onClose}
                aria-label="Close create organization form"
                disabled={isSubmitting}
              >
                x
              </button>
            </div>

            <p className={styles.copy}>
              This posts directly to the organizations API with your current authenticated session.
            </p>

            <form className={styles.form} onSubmit={handleSubmit}>
              <label className={styles.field}>
                <span>Name</span>
                <input
                  type="text"
                  value={name}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => setName(event.target.value)}
                  placeholder="Computer Science Club"
                  autoComplete="off"
                  required
                />
              </label>

              {isAuthLoading ? <p className={styles.status}>Checking session...</p> : null}
              {!isAuthed && !isAuthLoading ? (
                <p className={styles.status}>
                  Sign in before creating an organization. The request uses `credentials: include`.
                </p>
              ) : null}
              {error ? <p className={styles.error}>{error}</p> : null}

              <div className={styles.actions}>
                <PillButton type="button" subtle onClick={onClose} disabled={isSubmitting}>
                  cancel
                </PillButton>
                <PillButton
                  type="submit"
                  accent
                  disabled={isSubmitting || isAuthLoading || name.trim().length === 0}
                >
                  {isSubmitting ? 'creating...' : 'create organization'}
                </PillButton>
              </div>
            </form>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
