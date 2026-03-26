import styles from './ExitOverlay.module.css'

/**
 * A shared exit overlay component that provides the seamless background transition
 * effect when navigating between routes. Used by Lander, App, and ErrorPage.
 *
 * Activated by the `is-exiting` class on `document.body` (set by `useExitNavigation`).
 * Supports the `fading-back` class for bfcache restoration animations.
 */
export function ExitOverlay() {
  return <div className={styles.exitOverlay} aria-hidden="true" />
}
