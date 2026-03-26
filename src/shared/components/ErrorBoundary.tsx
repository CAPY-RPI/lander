import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught component error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      // If we are already on the error page and it still crashes,
      // render a minimal fallback to avoid infinite redirect loops.
      if (window.location.pathname === '/error') {
        return (
          <div style={{ padding: '20px', color: '#fff', textAlign: 'center' }}>
            <h1>Critical System Failure</h1>
            <p>Please try again later.</p>
          </div>
        )
      }

      // Hard redirect to the dedicated error page.
      // This ensures a fresh React state.
      if (window.location.pathname !== '/error') {
        sessionStorage.setItem('last_attempted_path', window.location.pathname)
      }
      window.location.assign('/error')
      return null
    }

    return this.props.children
  }
}
