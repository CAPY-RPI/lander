import { useEffect, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { PillButton } from '@/shared/components/PillButton'
import { useAuth } from '@/shared/context/AuthContext'
import { createEvent } from '@/shared/services/eventService'
import styles from './CreateEventModal.module.css'

type CreateEventModalProps = {
  isOpen: boolean
  onClose: () => void
  onCreated: () => void
}

type CreateEventFormState = {
  title: string
  location: string
  eventTime: string
  description: string
}

const DEFAULT_ORG_ID = '66168f44-624a-47ad-9b07-7a92121bce01'

const initialFormState: CreateEventFormState = {
  title: '',
  location: '',
  eventTime: '',
  description: '',
}

function toEventTimeISOString(value: string) {
  if (!value) return undefined

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
}

/**
 * Dedicated modal for creating an event without leaving the dashboard.
 * The API requires cookie auth and an org admin-scoped org_id.
 */
export function CreateEventModal({ isOpen, onClose, onCreated }: CreateEventModalProps) {
  const { isAuthed, isLoading: isAuthLoading } = useAuth()
  const [formState, setFormState] = useState<CreateEventFormState>(initialFormState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) {
      setFormState(initialFormState)
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

  const handleChange =
    (field: keyof CreateEventFormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormState((current) => ({
        ...current,
        [field]: event.target.value,
      }))
    }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isAuthed) {
      setError(
        'Sign in first. Create event requests require your auth cookie and org admin access.',
      )
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await createEvent({
        org_id: DEFAULT_ORG_ID,
        title: formState.title.trim() || undefined,
        location: formState.location.trim() || undefined,
        event_time: toEventTimeISOString(formState.eventTime),
        description: formState.description.trim() || undefined,
      })
      onCreated()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Could not create event.')
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
            aria-labelledby="create-event-title"
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.header}>
              <div>
                <p className={styles.eyebrow}>new event</p>
                <h2 className={styles.title} id="create-event-title">
                  create an event
                </h2>
              </div>
              <button
                type="button"
                className={styles.closeButton}
                onClick={onClose}
                aria-label="Close create event form"
                disabled={isSubmitting}
              >
                x
              </button>
            </div>

            <p className={styles.copy}>
              Submit with the signed-in session cookie. This form posts to the hardcoded org ID `
              {DEFAULT_ORG_ID}` and still requires org admin access for that org.
            </p>

            <form className={styles.form} onSubmit={handleSubmit}>
              <label className={styles.field}>
                <span>Title</span>
                <input
                  type="text"
                  value={formState.title}
                  onChange={handleChange('title')}
                  placeholder="Spring Networking Night"
                  autoComplete="off"
                />
              </label>

              <label className={styles.field}>
                <span>Location</span>
                <input
                  type="text"
                  value={formState.location}
                  onChange={handleChange('location')}
                  placeholder="Engineering Building, Room 210"
                  autoComplete="off"
                />
              </label>

              <label className={styles.field}>
                <span>Event time</span>
                <input
                  type="datetime-local"
                  value={formState.eventTime}
                  onChange={handleChange('eventTime')}
                />
              </label>

              <label className={styles.field}>
                <span>Description</span>
                <textarea
                  value={formState.description}
                  onChange={handleChange('description')}
                  placeholder="Spring networking night for students and alumni"
                  rows={5}
                />
              </label>

              <div className={styles.metaCard}>
                <span className={styles.metaLabel}>Org ID</span>
                <code className={styles.metaValue}>{DEFAULT_ORG_ID}</code>
              </div>

              {isAuthLoading ? <p className={styles.status}>Checking session...</p> : null}
              {!isAuthed && !isAuthLoading ? (
                <p className={styles.status}>
                  Sign in before creating an event. The request is sent with `credentials: include`.
                </p>
              ) : null}
              {error ? <p className={styles.error}>{error}</p> : null}

              <div className={styles.actions}>
                <PillButton type="button" subtle onClick={onClose} disabled={isSubmitting}>
                  cancel
                </PillButton>
                <PillButton type="submit" accent disabled={isSubmitting || isAuthLoading}>
                  {isSubmitting ? 'creating...' : 'create event'}
                </PillButton>
              </div>
            </form>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
