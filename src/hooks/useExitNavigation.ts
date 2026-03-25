import { useCallback, useRef } from 'react'
import type { MouseEvent } from 'react'

export function useExitNavigation(delayMs = 340) {
  const isExitingRef = useRef(false)

  return useCallback(
    (event: MouseEvent<HTMLAnchorElement>, url: string) => {
      event.preventDefault()

      if (isExitingRef.current) {
        return
      }

      isExitingRef.current = true
      document.body.classList.add('is-exiting')

      window.setTimeout(() => {
        window.location.assign(url)
      }, delayMs)
    },
    [delayMs],
  )
}
