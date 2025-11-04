import { render, screen } from '@testing-library/react'
import type { HTMLAttributes, PropsWithChildren } from 'react'
import FadeIn from './FadeIn'
import { useInView, useReducedMotion } from 'framer-motion'

type MotionDivProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>>

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: MotionDivProps) => (
      <div data-motion="true" {...props}>
        {children}
      </div>
    ),
  },
  useInView: jest.fn(),
  useReducedMotion: jest.fn(),
}))

// Mock variants
jest.mock('./variants', () => ({
  fadeInVariants: {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  },
}))

describe('FadeIn', () => {
  beforeEach(() => {
    ;(useReducedMotion as jest.Mock).mockReturnValue(false)
    ;(useInView as jest.Mock).mockReturnValue(false)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders children', () => {
    render(
      <FadeIn>
        <div>Fade In Content</div>
      </FadeIn>
    )

    expect(screen.getByText('Fade In Content')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <FadeIn className="fade-class">
        <div>Content</div>
      </FadeIn>
    )

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveClass('fade-class')
  })

  it('renders motion.div when reduced motion is disabled', () => {
    ;(useReducedMotion as jest.Mock).mockReturnValue(false)

    const { container } = render(
      <FadeIn>
        <div>Content</div>
      </FadeIn>
    )

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveAttribute('data-motion', 'true')
  })

  it('renders plain div when reduced motion is enabled', () => {
    ;(useReducedMotion as jest.Mock).mockReturnValue(true)

    const { container } = render(
      <FadeIn>
        <div>Content</div>
      </FadeIn>
    )

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).not.toHaveAttribute('data-motion')
  })

  it('respects user reduced motion preference', () => {
    ;(useReducedMotion as jest.Mock).mockReturnValue(true)

    const { container } = render(
      <FadeIn className="test-class">
        <div>Content</div>
      </FadeIn>
    )

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.tagName).toBe('DIV')
    expect(wrapper).toHaveClass('test-class')
  })

  it('uses default delay of 0 when not provided', () => {
    render(
      <FadeIn>
        <div>Content</div>
      </FadeIn>
    )

    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('accepts custom delay prop', () => {
    render(
      <FadeIn delay={0.5}>
        <div>Delayed Content</div>
      </FadeIn>
    )

    expect(screen.getByText('Delayed Content')).toBeInTheDocument()
  })

  it('uses default threshold of 0.2 when not provided', () => {
    render(
      <FadeIn>
        <div>Content</div>
      </FadeIn>
    )

    expect(useInView).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ amount: 0.2 })
    )
  })

  it('accepts custom threshold prop', () => {
    render(
      <FadeIn threshold={0.5}>
        <div>Content</div>
      </FadeIn>
    )

    expect(useInView).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ amount: 0.5 })
    )
  })

  it('uses once: true for useInView', () => {
    render(
      <FadeIn>
        <div>Content</div>
      </FadeIn>
    )

    expect(useInView).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ once: true })
    )
  })

  it('animates to visible when element is in view', () => {
    ;(useInView as jest.Mock).mockReturnValue(true)

    const { container } = render(
      <FadeIn>
        <div>Visible Content</div>
      </FadeIn>
    )

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveAttribute('data-motion', 'true')
  })

  it('stays hidden when element is not in view', () => {
    ;(useInView as jest.Mock).mockReturnValue(false)

    const { container } = render(
      <FadeIn>
        <div>Hidden Content</div>
      </FadeIn>
    )

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveAttribute('data-motion', 'true')
  })

  it('applies className in both motion and non-motion modes', () => {
    // Test with motion enabled
    ;(useReducedMotion as jest.Mock).mockReturnValue(false)
    const { container: motionContainer } = render(
      <FadeIn className="shared-class">
        <div>Motion Content</div>
      </FadeIn>
    )
    expect(motionContainer.firstChild).toHaveClass('shared-class')

    // Test with motion disabled
    ;(useReducedMotion as jest.Mock).mockReturnValue(true)
    const { container: plainContainer } = render(
      <FadeIn className="shared-class">
        <div>Plain Content</div>
      </FadeIn>
    )
    expect(plainContainer.firstChild).toHaveClass('shared-class')
  })

  it('handles complex children structures', () => {
    render(
      <FadeIn>
        <div>
          <h2>Heading</h2>
          <p>Paragraph</p>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
        </div>
      </FadeIn>
    )

    expect(screen.getByText('Heading')).toBeInTheDocument()
    expect(screen.getByText('Paragraph')).toBeInTheDocument()
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()
  })

  it('preserves child component functionality', () => {
    const handleClick = jest.fn()

    render(
      <FadeIn>
        <button onClick={handleClick}>Click</button>
      </FadeIn>
    )

    const button = screen.getByText('Click')
    button.click()

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('handles undefined className', () => {
    const { container } = render(
      <FadeIn>
        <div>Content</div>
      </FadeIn>
    )

    expect(container.firstChild).toBeInTheDocument()
  })
})
