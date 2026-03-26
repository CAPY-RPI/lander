import React from 'react'
import styles from './ProfileSection.module.css'

interface ProfileFieldProps {
  label: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function ProfileField({ label, type = 'text', value, onChange }: ProfileFieldProps) {
  return (
    <label className={styles.field}>
      <span className={styles.fieldLabel}>{label}</span>
      <input className={styles.input} type={type} value={value} onChange={onChange} />
    </label>
  )
}
