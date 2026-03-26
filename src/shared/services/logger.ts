/**
 * A central logging utility that automatically suppresses certain log levels in production.
 * Uses `import.meta.env.DEV` (provided by Vite) to determine the environment.
 */

type LogArgs = unknown[]

export const logger = {
  /**
   * Logs a debug message. Only visible in development mode.
   */
  debug: (...args: LogArgs) => {
    if (import.meta.env.DEV) {
      console.debug('[DEBUG]', ...args)
    }
  },

  /**
   * Logs an info message. Only visible in development mode.
   */
  info: (...args: LogArgs) => {
    if (import.meta.env.DEV) {
      console.info('[INFO]', ...args)
    }
  },

  /**
   * Logs a warning message. Only visible in development mode.
   */
  warn: (...args: LogArgs) => {
    if (import.meta.env.DEV) {
      console.warn('[WARN]', ...args)
    }
  },

  /**
   * Logs an error message. Always visible, but provides more context in development.
   */
  error: (...args: LogArgs) => {
    // We always log errors, but we can tag them differently
    if (import.meta.env.DEV) {
      console.error('[ERROR]', ...args)
    } else {
      console.error(...args)
    }
  },
}
