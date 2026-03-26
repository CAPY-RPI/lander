import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent } from 'react'
import { AnimatedPanel } from '@/shared/components/AnimatedPanel'
import { useAuth } from '@/shared/context/AuthContext'
import buttonStyles from '@/shared/components/Button.module.css'
import styles from './ProfileSection.module.css'

export function ProfileSection() {
  const { user, isAuthed, saveProfile } = useAuth()
  const [form, setForm] = useState({
    name: '',
    email: '',
    classYear: '',
    phoneNumber: '',
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const displayName = form.name.trim() || 'Campus User'
  const initials =
    displayName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('') || 'CU'

  useEffect(() => {
    if (!user) {
      setForm({
        name: '',
        email: '',
        classYear: '',
        phoneNumber: '',
      })
      return
    }

    setForm({
      name: `${user.first_name} ${user.last_name}`.trim(),
      email: user.email,
      classYear: user.class_year ?? '',
      phoneNumber: user.phone_number ?? '',
    })
  }, [user])

  const initialForm = useMemo(() => {
    if (!user) return null
    return {
      name: `${user.first_name} ${user.last_name}`.trim(),
      email: user.email,
      classYear: user.class_year ?? '',
      phoneNumber: user.phone_number ?? '',
    }
  }, [user])

  const isDirty =
    initialForm != null &&
    (form.name !== initialForm.name ||
      form.email !== initialForm.email ||
      form.classYear !== initialForm.classYear ||
      form.phoneNumber !== initialForm.phoneNumber)

  const handleFieldChange =
    (field: keyof typeof form) => (event: ChangeEvent<HTMLInputElement>) => {
      setForm((current) => ({ ...current, [field]: event.target.value }))
    }

  const handleSave = async () => {
    if (!user || !isDirty) return

    const trimmedName = form.name.trim()
    const nameParts = trimmedName.split(/\s+/).filter(Boolean)
    const firstName = nameParts[0] ?? ''
    const lastName = nameParts.slice(1).join(' ')

    setIsSaving(true)
    setSaveError(null)
    try {
      await saveProfile({
        email: form.email.trim(),
        first_name: firstName,
        last_name: lastName,
        class_year: form.classYear.trim(),
        phone_number: form.phoneNumber.trim(),
      })
    } catch {
      setSaveError('Could not save changes. Check the update route payload and try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <AnimatedPanel className={`panel ${styles.profilePanel}`} id="profile" staggerIndex={1}>
      <div className={styles.shell}>
        {isAuthed && user ? (
          <section className={styles.formStack}>
            <div className={styles.profileHeader}>
              <div className={styles.avatar} aria-hidden="true">
                {initials}
              </div>
              <div className={styles.headerText}>
                <h1 className={styles.profileName}>{displayName}</h1>
              </div>
            </div>

            <div className={styles.formGrid}>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Name</span>
                <input
                  className={styles.input}
                  type="text"
                  value={form.name}
                  onChange={handleFieldChange('name')}
                />
              </label>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Email</span>
                <input
                  className={styles.input}
                  type="email"
                  value={form.email}
                  onChange={handleFieldChange('email')}
                />
              </label>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Class Year</span>
                <input
                  className={styles.input}
                  type="text"
                  value={form.classYear}
                  onChange={handleFieldChange('classYear')}
                />
              </label>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Phone Number</span>
                <input
                  className={styles.input}
                  type="tel"
                  value={form.phoneNumber}
                  onChange={handleFieldChange('phoneNumber')}
                />
              </label>
            </div>

            {isDirty ? (
              <div className={styles.confirmBar}>
                <span className={styles.confirmText}>Unsaved changes</span>
                <button
                  type="button"
                  className={`${buttonStyles.pillButton} ${buttonStyles.accent} ${styles.confirmButton}`}
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? 'saving...' : 'confirm'}
                </button>
              </div>
            ) : null}
            {saveError ? <p className={styles.errorText}>{saveError}</p> : null}
          </section>
        ) : (
          <section className={styles.formStack}>
            <div className={styles.signInPrompt}>
              <h2 className={styles.promptTitle}>please sign in</h2>
              <p className={styles.promptDescription}>you're not you when you're signed out</p>
            </div>
          </section>
        )}
      </div>
    </AnimatedPanel>
  )
}
