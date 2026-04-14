import type { MouseEvent } from 'react'
import { TopNav } from '@/shared/components/TopNav'
import { SearchIcon } from '@/shared/components/icons/SearchIcon'
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
          <SearchIcon className={styles.searchGlyph} />
        </button>
      }
    />
  )
}
