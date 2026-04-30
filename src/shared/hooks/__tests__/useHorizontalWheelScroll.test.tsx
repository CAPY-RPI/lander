import { fireEvent, render } from '@testing-library/react'
import { useHorizontalWheelScroll } from '../useHorizontalWheelScroll'
import '@testing-library/jest-dom'
import { useRef } from 'react'

describe('useHorizontalWheelScroll', () => {
  function defineScrollableMetrics(
    node: HTMLElement,
    values: {
      clientWidth: number
      scrollWidth: number
      initialScrollLeft?: number
    },
  ) {
    let scrollLeft = values.initialScrollLeft ?? 0

    Object.defineProperty(node, 'clientWidth', {
      configurable: true,
      get: () => values.clientWidth,
    })

    Object.defineProperty(node, 'scrollWidth', {
      configurable: true,
      get: () => values.scrollWidth,
    })

    Object.defineProperty(node, 'scrollLeft', {
      configurable: true,
      get: () => scrollLeft,
      set: (value: number) => {
        scrollLeft = value
      },
    })
  }

  function TestComponent({
    releaseOnEdges = false,
    ignoreInteractiveElements = true,
    enableDrag = true,
  }: {
    releaseOnEdges?: boolean
    ignoreInteractiveElements?: boolean
    enableDrag?: boolean
  }) {
    const ref = useRef<HTMLDivElement>(null)
    useHorizontalWheelScroll(ref, {
      endCutoffPx: 0,
      releaseOnEdges,
      ignoreInteractiveElements,
      enableDrag,
    })
    return (
      <div ref={ref} data-testid="test-div">
        <button type="button">Card</button>
      </div>
    )
  }

  it('renders and attaches ref', () => {
    const { getByTestId } = render(<TestComponent />)
    const div = getByTestId('test-div')
    expect(div).toBeInTheDocument()
  })

  it('handles wheel input while there is remaining horizontal space', () => {
    const { getByTestId } = render(<TestComponent releaseOnEdges />)
    const div = getByTestId('test-div')
    defineScrollableMetrics(div, { clientWidth: 200, scrollWidth: 500, initialScrollLeft: 120 })

    const eventHandled = fireEvent.wheel(div, { deltaY: 60, cancelable: true })

    expect(eventHandled).toBe(false)
    expect(div.scrollLeft).toBe(186)
  })

  it('releases wheel input at the rail edge when configured', () => {
    const { getByTestId } = render(<TestComponent releaseOnEdges />)
    const div = getByTestId('test-div')
    defineScrollableMetrics(div, { clientWidth: 200, scrollWidth: 500, initialScrollLeft: 300 })

    const eventHandled = fireEvent.wheel(div, { deltaY: 60, cancelable: true })

    expect(eventHandled).toBe(true)
    expect(div.scrollLeft).toBe(300)
  })

  it('does not activate drag handlers when drag support is disabled', () => {
    const { getByRole, getByTestId } = render(
      <TestComponent ignoreInteractiveElements={false} enableDrag={false} />,
    )
    const div = getByTestId('test-div')
    const button = getByRole('button', { name: 'Card' })
    defineScrollableMetrics(div, { clientWidth: 200, scrollWidth: 500, initialScrollLeft: 120 })

    const addSpy = jest.spyOn(div.classList, 'add')
    fireEvent.mouseDown(button, { button: 0, clientX: 100 })
    fireEvent.mouseMove(window, { clientX: 70 })
    fireEvent.mouseUp(window)

    expect(addSpy).not.toHaveBeenCalled()
    expect(div.scrollLeft).toBe(120)
    addSpy.mockRestore()
  })
})
