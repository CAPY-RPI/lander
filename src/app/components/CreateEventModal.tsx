import { useEffect, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { PillButton } from '@/shared/components/PillButton'
import { useAuth } from '@/shared/context/AuthContext'
import { useOrganizations } from '@/shared/hooks/useOrganizations'
import { useUserOrganizations } from '@/shared/hooks/useUserOrganizations'
import { createEvent } from '@/shared/services/eventService'
import styles from './CreateEventModal.module.css'

type CreateEventModalProps = {
  isOpen: boolean
  onClose: () => void
  onCreated: () => void
}

type CreateEventFormState = {
  orgId: string
  title: string
  location: string
  eventTime: string
  description: string
}

function getCurrentDateTimeInputValue() {
  const now = new Date()
  now.setSeconds(0, 0)

  const timezoneOffset = now.getTimezoneOffset()
  const localDate = new Date(now.getTime() - timezoneOffset * 60_000)
  return localDate.toISOString().slice(0, 16)
}

function createInitialFormState(): CreateEventFormState {
  return {
    orgId: '',
    title: '',
    location: '',
    eventTime: getCurrentDateTimeInputValue(),
    description: '',
  }
}

function toEventTimeISOString(value: string) {
  if (!value) return null

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

/**
 * Dedicated modal for creating an event without leaving the dashboard.
 * The API requires cookie auth and an org-scoped org_id, so the form limits
 * selection to organizations the current user belongs to.
 */
export function CreateEventModal({ isOpen, onClose, onCreated }: CreateEventModalProps) {
  const { isAuthed, isLoading: isAuthLoading, user } = useAuth()
  const {
    organizations,
    isLoading: isLoadingOrganizations,
    error: organizationsError,
  } = useOrganizations(50, 0, isOpen ? 1 : 0)
  const {
    organizations: myOrganizations,
    isLoading: isLoadingMyOrganizations,
    error: myOrganizationsError,
  } = useUserOrganizations(organizations, user?.uid, isAuthed, isOpen ? 1 : 0)
  const [formState, setFormState] = useState<CreateEventFormState>(() => createInitialFormState())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) {
      setFormState(createInitialFormState())
      setIsSubmitting(false)
      setError(null)
      return
    }

    setFormState((current) => {
      if (current.eventTime.length > 0) {
        return current
      }

      return {
        ...current,
        eventTime: getCurrentDateTimeInputValue(),
      }
    })

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

  useEffect(() => {
    if (!isOpen || myOrganizations.length === 0) {
      return
    }

    setFormState((current) => {
      if (
        current.orgId &&
        myOrganizations.some((organization) => organization.oid === current.orgId)
      ) {
        return current
      }

      return {
        ...current,
        orgId: myOrganizations[0].oid,
      }
    })
  }, [isOpen, myOrganizations])

  const handleChange =
    (field: keyof CreateEventFormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

    if (!formState.orgId) {
      setError('Join an organization first, then pick it here to create an event.')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await createEvent({
        org_id: formState.orgId,
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
              Submit with the signed-in session cookie. You can only create events for organizations
              you currently belong to.
            </p>

            <form className={styles.form} onSubmit={handleSubmit}>
              <label className={styles.field}>
                <span>Organization</span>
                <select value={formState.orgId} onChange={handleChange('orgId')}>
                  <option value="" disabled>
                    {isAuthed ? 'Select an organization' : 'Sign in to load your organizations'}
                  </option>
                  {myOrganizations.map((organization) => (
                    <option key={organization.oid} value={organization.oid}>
                      {organization.name}
                    </option>
                  ))}
                </select>
              </label>

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

              {isAuthLoading ? <p className={styles.status}>Checking session...</p> : null}
              {isAuthed && isLoadingOrganizations ? (
                <p className={styles.status}>Loading organizations...</p>
              ) : null}
              {isAuthed && isLoadingMyOrganizations ? (
                <p className={styles.status}>Loading your organizations...</p>
              ) : null}
              {!isAuthed && !isAuthLoading ? (
                <p className={styles.status}>
                  Sign in before creating an event. The request is sent with `credentials: include`.
                </p>
              ) : null}
              {isAuthed &&
              !isLoadingOrganizations &&
              !isLoadingMyOrganizations &&
              myOrganizations.length === 0 ? (
                <p className={styles.status}>
                  You are not in any organizations yet. Join one first to create an event.
                </p>
              ) : null}
              {organizationsError ? <p className={styles.error}>{organizationsError}</p> : null}
              {myOrganizationsError ? <p className={styles.error}>{myOrganizationsError}</p> : null}
              {error ? <p className={styles.error}>{error}</p> : null}

              <div className={styles.actions}>
                <PillButton type="button" subtle onClick={onClose} disabled={isSubmitting}>
                  cancel
                </PillButton>
                <PillButton
                  type="submit"
                  accent
                  disabled={
                    isSubmitting ||
                    isAuthLoading ||
                    isLoadingOrganizations ||
                    isLoadingMyOrganizations ||
                    !isAuthed ||
                    myOrganizations.length === 0 ||
                    formState.orgId.length === 0
                  }
                >
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
