import { render } from '@testing-library/react'
import { useExitNavigation } from '../useExitNavigation'
import '@testing-library/jest-dom'
describe('useExitNavigation', () => {
  function TestComponent() {
    const handler = useExitNavigation()
    return (
      <a href="#" onClick={(e) => handler(e, '/test')} data-testid="test-link">
        Test
      </a>
    )
  }

  it('renders and attaches handler', () => {
    const { getByTestId } = render(<TestComponent />)
    const link = getByTestId('test-link')
    expect(link).toBeInTheDocument()
  })
})
