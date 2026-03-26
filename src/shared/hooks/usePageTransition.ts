import { useEffect } from 'react'

interface PageTransitionOptions {
  /** Whether to animate a fade-back when restored from bfcache (back/forward navigation). Default: false. */
  fadingBack?: boolean
}

/**
 * Manages the page transition lifecycle on mount:
 * - Removes the `is-exiting` class from `document.body` (prevents overlay persisting on back navigation).
 * - Listens for `pageshow` events to handle bfcache restoration.
 * - Optionally triggers a `fading-back` class for a smooth fade-in animation.
 */
export function usePageTransition(options: PageTransitionOptions = { fadingBack: true }) {
  useEffect(() => {
    document.body.classList.remove('is-exiting')

    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        document.body.classList.remove('is-exiting')
        if (options.fadingBack) {
          document.body.classList.add('fading-back')
          setTimeout(() => {
            document.body.classList.remove('fading-back')
          }, 350)
        }
      }
    }

    window.addEventListener('pageshow', handlePageShow)
    return () => window.removeEventListener('pageshow', handlePageShow)
  }, [])
}
