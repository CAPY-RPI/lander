import { render } from '@testing-library/react'
import { useRevealProgress } from '../useRevealProgress'
import '@testing-library/jest-dom'
describe('useRevealProgress', () => {
  function TestComponent() {
    const [ref, progress] = useRevealProgress<HTMLDivElement>()
    return (
      <div ref={ref} data-testid="test-div">
        {progress.progress}
      </div>
    )
  }

  it('renders and provides progress', () => {
    const { getByTestId } = render(<TestComponent />)
    const div = getByTestId('test-div')
    expect(div).toBeInTheDocument()
  })
})
