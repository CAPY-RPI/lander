import { useEffect, useMemo, useState } from 'react'
import { ProfileField } from './ProfileField'
import { useAuth } from '@/shared/context/AuthContext'
import { AnimatedPanel } from '@/shared/components/AnimatedPanel'
import styles from './ProfileSection.module.css'
import { PillButton } from '@/shared/components/PillButton'

export function ProfileSection() {
  const { user, isAuthed, saveProfile } = useAuth()
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    grad_year: '',
    personal_email: '',
    school_email: '',
    phone: '',
    role: '',
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setForm({
        first_name: '',
        last_name: '',
        grad_year: '',
        personal_email: '',
        school_email: '',
        phone: '',
        role: '',
      })
      return
    }
    setForm({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      grad_year: user.grad_year ? String(user.grad_year) : '',
      personal_email: user.personal_email || '',
      school_email: user.school_email || '',
      phone: user.phone || '',
      role: user.role || '',
    })
  }, [user])

  const initialForm = useMemo(() => {
    if (!user) return null
    return {
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      grad_year: user.grad_year ? String(user.grad_year) : '',
      personal_email: user.personal_email || '',
      school_email: user.school_email || '',
      phone: user.phone || '',
      role: user.role || '',
    }
  }, [user])

  const isDirty =
    initialForm != null &&
    (form.first_name !== initialForm.first_name ||
      form.last_name !== initialForm.last_name ||
      form.grad_year !== initialForm.grad_year ||
      form.personal_email !== initialForm.personal_email ||
      form.school_email !== initialForm.school_email ||
      form.phone !== initialForm.phone ||
      form.role !== initialForm.role)

  const displayName = `${form.first_name} ${form.last_name}`.trim() || 'Campus User'
  const initials =
    [form.first_name, form.last_name]
      .filter(Boolean)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('') || 'CU'

  const handleFieldChange =
    (field: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((current) => ({ ...current, [field]: event.target.value }))
    }

  const handleSave = async () => {
    if (!user || !isDirty) return

    setIsSaving(true)
    setSaveError(null)
    try {
      await saveProfile({
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        grad_year: Number(form.grad_year),
        personal_email: form.personal_email.trim(),
        school_email: form.school_email.trim(),
        phone: form.phone.trim(),
        role: form.role.trim(),
      })
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Could not save changes. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <AnimatedPanel
      className={`panel ${styles.profilePanel}`}
      id="profile"
      staggerIndex={1}
      data-search-key="section:profile"
      data-search-label="profile"
      data-search-category="section"
      data-search-description="your account and profile details"
      data-search-keywords="profile account user details settings"
    >
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
              <ProfileField
                label="First Name"
                searchKey="profile:first_name"
                value={form.first_name}
                onChange={handleFieldChange('first_name')}
              />
              <ProfileField
                label="Last Name"
                searchKey="profile:last_name"
                value={form.last_name}
                onChange={handleFieldChange('last_name')}
              />
              <ProfileField
                label="Graduation Year"
                searchKey="profile:grad_year"
                type="number"
                value={form.grad_year}
                onChange={handleFieldChange('grad_year')}
              />
              <ProfileField
                label="Personal Email"
                searchKey="profile:personal_email"
                type="email"
                value={form.personal_email}
                onChange={handleFieldChange('personal_email')}
              />
              <ProfileField
                label="School Email"
                searchKey="profile:school_email"
                type="email"
                value={form.school_email}
                onChange={handleFieldChange('school_email')}
              />
              <ProfileField
                label="Phone"
                searchKey="profile:phone"
                type="tel"
                value={form.phone}
                onChange={handleFieldChange('phone')}
              />
              <ProfileField
                label="Role"
                searchKey="profile:role"
                value={form.role}
                onChange={handleFieldChange('role')}
              />
              <div
                className={`${styles.confirmBar} ${styles.fieldWide} ${
                  isDirty ? styles.confirmVisible : styles.confirmHidden
                }`}
              >
                <span className={styles.confirmText}>Unsaved changes</span>
                <PillButton
                  type="button"
                  accent
                  className={styles.confirmButton}
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? 'saving...' : 'confirm'}
                </PillButton>
              </div>
              {saveError ? (
                <p className={`${styles.errorText} ${styles.fieldWide}`}>{saveError}</p>
              ) : null}
            </div>
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
