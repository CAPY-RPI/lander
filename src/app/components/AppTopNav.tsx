import type { MouseEvent } from 'react'
import { TopNav } from '@/shared/components/TopNav'
import { appNavItems } from '@/shared/data/content'
import { useAuth } from '@/shared/context/AuthContext'
import { API_VERSION } from '@/shared/services/apiClient'
import styles from './AppTopNav.module.css'

type AppTopNavProps = {
  onOpenSearch: () => void
}

export function AppTopNav({ onOpenSearch }: AppTopNavProps) {
  const { isAuthed, login, logout } = useAuth()

  const onCtaClickOverride = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    if (isAuthed) {
      logout()
    } else {
      login()
    }
  }

  return (
    <TopNav
      items={appNavItems}
      ctaLabel={isAuthed ? 'sign out' : 'sign in'}
      ctaHref={isAuthed ? '#logout' : `${API_VERSION}/auth/google`}
      onCtaClickOverride={onCtaClickOverride}
      actions={
        <button
          type="button"
          className={styles.searchButton}
          onClick={onOpenSearch}
          aria-label="Open search"
          title="Search"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
              d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"
              fill="currentColor"
            />
          </svg>
        </button>
      }
    />
  )
}
