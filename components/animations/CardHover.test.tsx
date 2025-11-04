import { render, screen } from '@testing-library/react'
import type { HTMLAttributes, PropsWithChildren } from 'react'
import CardHover from './CardHover'
import { useReducedMotion } from 'framer-motion'

type MotionDivProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>>

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({
      children,
      initial,
      whileHover,
      variants,
      ...props
    }: MotionDivProps & { initial?: unknown; whileHover?: unknown; variants?: unknown }) => (
      <div data-motion="true" {...props}>
        {children}
      </div>
    ),
  },
  useReducedMotion: jest.fn(),
}))

// Mock variants
jest.mock('./variants', () => ({
  cardHoverVariants: {
    rest: { scale: 1 },
    hover: { scale: 1.02, transition: { duration: 0.2, ease: 'easeInOut' } },
  },
}))

describe('CardHover', () => {
  beforeEach(() => {
    ;(useReducedMotion as jest.Mock).mockReturnValue(false)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders children', () => {
    render(
      <CardHover>
        <div>Test Content</div>
      </CardHover>
    )

    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <CardHover className="custom-class">
        <div>Content</div>
      </CardHover>
    )

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveClass('custom-class')
  })

  it('renders motion.div when reduced motion is disabled', () => {
    ;(useReducedMotion as jest.Mock).mockReturnValue(false)

    const { container } = render(
      <CardHover>
        <div>Content</div>
      </CardHover>
    )

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveAttribute('data-motion', 'true')
  })

  it('renders plain div when reduced motion is enabled', () => {
    ;(useReducedMotion as jest.Mock).mockReturnValue(true)

    const { container } = render(
      <CardHover>
        <div>Content</div>
      </CardHover>
    )

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).not.toHaveAttribute('data-motion')
  })

  it('respects user reduced motion preference', () => {
    ;(useReducedMotion as jest.Mock).mockReturnValue(true)

    const { container } = render(
      <CardHover className="test-class">
        <div>Content</div>
      </CardHover>
    )

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.tagName).toBe('DIV')
    expect(wrapper).toHaveClass('test-class')
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('applies className in both motion and non-motion modes', () => {
    // Test with motion enabled
    ;(useReducedMotion as jest.Mock).mockReturnValue(false)
    const { container: motionContainer } = render(
      <CardHover className="shared-class">
        <div>Motion Content</div>
      </CardHover>
    )
    expect(motionContainer.firstChild).toHaveClass('shared-class')

    // Test with motion disabled
    ;(useReducedMotion as jest.Mock).mockReturnValue(true)
    const { container: plainContainer } = render(
      <CardHover className="shared-class">
        <div>Plain Content</div>
      </CardHover>
    )
    expect(plainContainer.firstChild).toHaveClass('shared-class')
  })

  it('handles undefined className', () => {
    const { container } = render(
      <CardHover>
        <div>Content</div>
      </CardHover>
    )

    expect(container.firstChild).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('handles complex children structures', () => {
    render(
      <CardHover>
        <div>
          <h2>Title</h2>
          <p>Description</p>
          <button>Action</button>
        </div>
      </CardHover>
    )

    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Description')).toBeInTheDocument()
    expect(screen.getByText('Action')).toBeInTheDocument()
  })

  it('preserves child component functionality', () => {
    const handleClick = jest.fn()

    render(
      <CardHover>
        <button onClick={handleClick}>Click Me</button>
      </CardHover>
    )

    const button = screen.getByText('Click Me')
    button.click()

    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
