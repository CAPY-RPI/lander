import { render } from '@testing-library/react'
import { TopNav } from '../TopNav'
import '@testing-library/jest-dom'

// Mock React Router for the embedded useExitNavigation hook
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}))

// Mock IntersectionObserver for StaggerWords and framer-motion presence
beforeAll(() => {
  const mockIntersectionObserver = jest.fn()
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  })
  window.IntersectionObserver = mockIntersectionObserver
})

describe('TopNav Component', () => {
  it('renders the TopNav container successfully', () => {
    const { container } = render(<TopNav />)

    // Check if the primary navigation container mounted
    const nav = container.querySelector('nav')
    expect(nav).toBeInTheDocument()

    // Verify the primary CTA links to the internal /app route
    const cta = container.querySelector('a[href="/app"]')
    expect(cta).toBeInTheDocument()
  })
})
