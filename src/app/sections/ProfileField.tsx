import React from 'react'
import styles from './ProfileSection.module.css'

interface ProfileFieldProps {
  label: string
  searchKey?: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function ProfileField({
  label,
  searchKey,
  type = 'text',
  value,
  onChange,
}: ProfileFieldProps) {
  return (
    <label className={styles.field}>
      <span className={styles.fieldLabel}>{label}</span>
      <input
        className={styles.input}
        type={type}
        value={value}
        onChange={onChange}
        data-search-key={searchKey}
        data-search-label={label}
        data-search-category="profile field"
        data-search-description={`Edit ${label.toLowerCase()}`}
        data-search-keywords={`profile ${label.toLowerCase()}`}
        data-search-section="profile"
        data-search-action="focus"
      />
    </label>
  )
}
