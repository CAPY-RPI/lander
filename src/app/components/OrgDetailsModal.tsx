import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { AppOrganization } from '@/app/data/organizations'
import type { Event } from '@/shared/models/event'
import type { OrganizationMember } from '@/shared/models/organization'
import { PillButton } from '@/shared/components/PillButton'
import { useAuth } from '@/shared/context/AuthContext'
import {
  addOrganizationMember,
  listOrganizationEvents,
  listOrganizationMembers,
  removeOrganizationMember,
} from '@/shared/services/organizationService'
import styles from './OrgDetailsModal.module.css'

type OrgDetailsModalProps = {
  organization: AppOrganization | null
  isOpen: boolean
  onClose: () => void
  onJoined: () => void
  onLeft: () => void
}

const dateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
})

const shortDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
})

function formatDateTime(value: string | null) {
  if (!value) return 'Time to be announced'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Time to be announced'
  return dateTimeFormatter.format(date)
}

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Unknown'
  return shortDateFormatter.format(date)
}

function formatMemberName(member: OrganizationMember) {
  const fullName = `${member.first_name} ${member.last_name}`.trim()
  return fullName || member.email || member.uid
}

/**
 * Shows a richer organization summary and lets the signed-in user join or leave.
 */
export function OrgDetailsModal({
  organization,
  isOpen,
  onClose,
  onJoined,
  onLeft,
}: OrgDetailsModalProps) {
  const { isAuthed, isLoading: isAuthLoading, login, user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)
  const [members, setMembers] = useState<OrganizationMember[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) {
      setIsSubmitting(false)
      setIsLoadingDetails(false)
      setMembers([])
      setEvents([])
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

  useEffect(() => {
    if (!isOpen || !organization) {
      return
    }

    let isCancelled = false

    const loadOrganizationDetails = async () => {
      setIsLoadingDetails(true)
      setError(null)

      try {
        const [membersResponse, eventsResponse] = await Promise.all([
          listOrganizationMembers(organization.oid),
          listOrganizationEvents(organization.oid, 20, 0),
        ])

        if (!isCancelled) {
          setMembers(membersResponse)
          setEvents(eventsResponse)
        }
      } catch (loadError) {
        if (!isCancelled) {
          setError(
            loadError instanceof Error ? loadError.message : 'Could not load organization details.',
          )
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingDetails(false)
        }
      }
    }

    loadOrganizationDetails()

    return () => {
      isCancelled = true
    }
  }, [isOpen, organization])

  const handleJoin = async () => {
    if (!organization) return

    if (!isAuthed) {
      login()
      return
    }

    if (!user?.uid) {
      setError('No authenticated user ID is available for joining this organization.')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await addOrganizationMember(organization.oid, { uid: user.uid, is_admin: false })
      onJoined()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Could not join organization.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLeave = async () => {
    if (!organization || !user?.uid) return

    setIsSubmitting(true)
    setError(null)

    try {
      await removeOrganizationMember(organization.oid, user.uid)
      onLeft()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Could not leave organization.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isMember =
    organization?.isMember === true ||
    (!!user?.uid && members.some((member) => member.uid === user.uid))
  const adminCount = members.filter((member) => member.is_admin).length
  const actionLabel = !isAuthed ? 'sign in to join' : isMember ? 'member' : 'join organization'

  return (
    <AnimatePresence>
      {isOpen && organization ? (
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
            aria-labelledby="org-details-title"
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onClick={(mouseEvent) => mouseEvent.stopPropagation()}
          >
            <div className={styles.header}>
              <div>
                <p className={styles.eyebrow}>organization details</p>
                <h2 className={styles.title} id="org-details-title">
                  {organization.name}
                </h2>
              </div>
              <button
                type="button"
                className={styles.closeButton}
                onClick={onClose}
                aria-label="Close organization details"
                disabled={isSubmitting}
              >
                x
              </button>
            </div>

            <p className={styles.copy}>
              View the org roster, skim upcoming events, and join or leave from the same modal.
            </p>

            <div className={styles.metaGrid}>
              <section className={styles.metaCard}>
                <span className={styles.metaLabel}>Status</span>
                <p className={styles.metaValue}>{isMember ? 'You are a member' : 'Open to join'}</p>
              </section>
              <section className={styles.metaCard}>
                <span className={styles.metaLabel}>Created</span>
                <p className={styles.metaValue}>{formatDate(organization.date_created)}</p>
              </section>
              <section className={styles.metaCard}>
                <span className={styles.metaLabel}>Updated</span>
                <p className={styles.metaValue}>{formatDate(organization.date_modified)}</p>
              </section>
              <section className={styles.metaCard}>
                <span className={styles.metaLabel}>Members</span>
                <p className={styles.metaValue}>
                  {members.length} total
                  {adminCount > 0 ? `, ${adminCount} admin${adminCount === 1 ? '' : 's'}` : ''}
                </p>
              </section>
            </div>

            <div className={styles.contentGrid}>
              <section className={styles.listCard}>
                <div className={styles.listHeader}>
                  <h3 className={styles.listTitle}>members</h3>
                  <span className={styles.listCount}>{members.length}</span>
                </div>
                {members.length > 0 ? (
                  <ul className={styles.list}>
                    {members.slice(0, 6).map((member) => (
                      <li key={member.uid} className={styles.listItem}>
                        <span>{formatMemberName(member)}</span>
                        {member.is_admin ? <strong className={styles.badge}>admin</strong> : null}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.emptyCopy}>No members loaded yet.</p>
                )}
              </section>

              <section className={styles.listCard}>
                <div className={styles.listHeader}>
                  <h3 className={styles.listTitle}>events</h3>
                  <span className={styles.listCount}>{events.length}</span>
                </div>
                {events.length > 0 ? (
                  <ul className={styles.list}>
                    {events.slice(0, 4).map((event) => (
                      <li key={event.eid} className={styles.eventItem}>
                        <span className={styles.eventTitle}>{event.title || 'Untitled event'}</span>
                        <span className={styles.eventMeta}>
                          {formatDateTime(event.event_time || null)}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.emptyCopy}>No organization events are scheduled yet.</p>
                )}
              </section>
            </div>

            {isLoadingDetails ? (
              <p className={styles.status}>Loading organization details...</p>
            ) : null}
            {isAuthLoading ? <p className={styles.status}>Checking session...</p> : null}
            {!isAuthed && !isAuthLoading ? (
              <p className={styles.status}>
                Joining uses the current authenticated session. Sign in to continue.
              </p>
            ) : null}
            {error ? <p className={styles.error}>{error}</p> : null}

            <div className={styles.actions}>
              {isMember ? (
                <PillButton
                  type="button"
                  subtle
                  onClick={handleLeave}
                  disabled={isSubmitting || isAuthLoading}
                >
                  {isSubmitting ? 'leaving...' : 'leave organization'}
                </PillButton>
              ) : (
                <PillButton
                  type="button"
                  accent
                  onClick={handleJoin}
                  disabled={isSubmitting || isAuthLoading}
                >
                  {isSubmitting ? 'joining...' : actionLabel}
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
