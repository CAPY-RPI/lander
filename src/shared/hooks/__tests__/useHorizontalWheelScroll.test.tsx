import { render } from '@testing-library/react'
import { useHorizontalWheelScroll } from '../useHorizontalWheelScroll'
import '@testing-library/jest-dom'
import { useRef } from 'react'
describe('useHorizontalWheelScroll', () => {
  function TestComponent() {
    const ref = useRef<HTMLDivElement>(null)
    useHorizontalWheelScroll(ref)
    return (
      <div ref={ref} data-testid="test-div">
        Test
      </div>
    )
  }

  it('renders and attaches ref', () => {
    const { getByTestId } = render(<TestComponent />)
    const div = getByTestId('test-div')
    expect(div).toBeInTheDocument()
  })
})
