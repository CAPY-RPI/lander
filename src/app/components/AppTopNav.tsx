import type { MouseEvent } from 'react'
import { TopNav } from '@/shared/components/TopNav'
import { appNavItems } from '@/shared/data/content'
import { useAuth } from '@/shared/context/AuthContext'
import { API_VERSION } from '@/shared/services/apiClient'

export function AppTopNav() {
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
    />
  )
}
