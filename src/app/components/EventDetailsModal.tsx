import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { AppEvent } from '@/app/data/events'
import { PillButton } from '@/shared/components/PillButton'
import { useAuth } from '@/shared/context/AuthContext'
import { registerForEvent, unregisterFromEvent } from '@/shared/services/eventService'
import styles from './EventDetailsModal.module.css'

type EventDetailsModalProps = {
  event: AppEvent | null
  isOpen: boolean
  onClose: () => void
  onRegistered: () => void
  onUnregistered: () => void
}

const eventDateFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
})

function formatEventTime(eventTime: string | null) {
  if (!eventTime) return 'Time to be announced'
  return eventDateFormatter.format(new Date(eventTime))
}

/**
 * Shows a richer event summary and lets the signed-in user register with the
 * same cookie-authenticated API client used elsewhere in the app.
 */
export function EventDetailsModal({
  event,
  isOpen,
  onClose,
  onRegistered,
  onUnregistered,
}: EventDetailsModalProps) {
  const { isAuthed, isLoading: isAuthLoading, login, user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) {
      setIsSubmitting(false)
      setError(null)
      return
    }

    const onKeyDown = (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.key === 'Escape' && !isSubmitting) {
        onClose()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen, isSubmitting, onClose])

  const handleRegister = async () => {
    if (!event) return

    if (!isAuthed) {
      login()
      return
    }

    if (!user?.uid) {
      setError('No authenticated user ID is available for registration.')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await registerForEvent(event.eid, user.uid)
      onRegistered()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Could not register for event.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUnregister = async () => {
    if (!event || !user?.uid) return

    setIsSubmitting(true)
    setError(null)

    try {
      await unregisterFromEvent(event.eid)
      onUnregistered()
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : 'Could not unregister from event.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const isRegistered = event?.isRegistered === true
  const registerLabel = !isAuthed ? 'sign in to register' : isRegistered ? 'registered' : 'register'

  return (
    <AnimatePresence>
      {isOpen && event ? (
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
            aria-labelledby="event-details-title"
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onClick={(mouseEvent) => mouseEvent.stopPropagation()}
          >
            <div className={styles.header}>
              <div>
                <p className={styles.eyebrow}>event details</p>
                <h2 className={styles.title} id="event-details-title">
                  {event.title}
                </h2>
              </div>
              <button
                type="button"
                className={styles.closeButton}
                onClick={onClose}
                aria-label="Close event details"
                disabled={isSubmitting}
              >
                x
              </button>
            </div>

            <p className={styles.copy}>{event.description}</p>

            <div className={styles.metaGrid}>
              <section className={styles.metaCard}>
                <span className={styles.metaLabel}>Time</span>
                <p className={styles.metaValue}>{formatEventTime(event.event_time)}</p>
              </section>
              <section className={styles.metaCard}>
                <span className={styles.metaLabel}>Location</span>
                <p className={styles.metaValue}>{event.location || 'Location to be announced'}</p>
              </section>
              <section className={styles.metaCard}>
                <span className={styles.metaLabel}>Status</span>
                <p className={styles.metaValue}>
                  {isRegistered ? 'You are registered' : 'Open for registration'}
                </p>
              </section>
              <section className={styles.metaCard}>
                <span className={styles.metaLabel}>Attendee</span>
                <p className={styles.metaValue}>
                  {user
                    ? `${user.first_name} ${user.last_name}`.trim() || user.school_email || user.uid
                    : 'Sign in required'}
                </p>
              </section>
            </div>

            {isAuthLoading ? <p className={styles.status}>Checking session...</p> : null}
            {!isAuthed && !isAuthLoading ? (
              <p className={styles.status}>
                Registering uses the current authenticated session. Sign in to continue.
              </p>
            ) : null}
            {error ? <p className={styles.error}>{error}</p> : null}

            <div className={styles.actions}>
              {isRegistered ? (
                <PillButton
                  type="button"
                  subtle
                  onClick={handleUnregister}
                  disabled={isSubmitting || isAuthLoading}
                >
                  {isSubmitting ? 'removing...' : 'unregister'}
                </PillButton>
              ) : (
                <PillButton
                  type="button"
                  accent
                  onClick={handleRegister}
                  disabled={isSubmitting || isAuthLoading}
                >
                  {isSubmitting ? 'registering...' : registerLabel}
                </PillButton>
              )}
              <PillButton type="button" subtle onClick={onClose} disabled={isSubmitting}>
                close
              </PillButton>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
