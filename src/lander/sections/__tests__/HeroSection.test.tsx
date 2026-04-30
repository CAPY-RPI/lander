import { render } from '@testing-library/react'
import { HeroSection } from '../HeroSection'
import '@testing-library/jest-dom'

// Mock React Router for the embedded useExitNavigation hook
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}))

// Mock IntersectionObserver and matchMedia for Framer Motion primitives
beforeAll(() => {
  const mockIntersectionObserver = jest.fn()
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  })
  window.IntersectionObserver = mockIntersectionObserver

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })
})

describe('HeroSection Component', () => {
  it('mounts and displays correctly routed CTAs', () => {
    const { container } = render(<HeroSection />)

    // Verify the "absolutely" CTA directs to the localized app route
    const appLinks = container.querySelectorAll('a[href="/app"]')
    expect(appLinks.length).toBeGreaterThan(0)

    // Verify the "how it works" modal trigger exists
    const howLink = container.querySelector('a[href="#features"]')
    expect(howLink).toBeInTheDocument()
  })
})
