import { useCallback, useRef, useEffect } from 'react'
import type { MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'

export function useExitNavigation(delayMs = 340) {
  const isExitingRef = useRef(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handler = () => {
      isExitingRef.current = false
    }
    window.addEventListener('pageshow', handler)
    return () => window.removeEventListener('pageshow', handler)
  }, [])

  return useCallback(
    (event: MouseEvent<HTMLAnchorElement>, url: string) => {
      event.preventDefault()

      if (isExitingRef.current) {
        return
      }

      isExitingRef.current = true
      document.body.classList.add('is-exiting')

      window.setTimeout(() => {
        if (url.startsWith('http')) {
          window.location.assign(url)
        } else {
          navigate(url)
        }
      }, delayMs)
    },
    [delayMs, navigate],
  )
}
