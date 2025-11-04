import { render, screen } from '@testing-library/react'
import type { HTMLAttributes, PropsWithChildren } from 'react'
import PageTransition from './PageTransition'
import { useReducedMotion } from 'framer-motion'

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
  useReducedMotion: jest.fn(),
}))

// Mock variants
jest.mock('./variants', () => ({
  pageVariants: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut', staggerChildren: 0.1 },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: 'easeIn' } },
  },
}))

describe('PageTransition', () => {
  beforeEach(() => {
    ;(useReducedMotion as jest.Mock).mockReturnValue(false)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders children', () => {
    render(
      <PageTransition>
        <div>Page Content</div>
      </PageTransition>
    )

    expect(screen.getByText('Page Content')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <PageTransition className="page-class">
        <div>Content</div>
      </PageTransition>
    )

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveClass('page-class')
  })

  it('renders motion.div when reduced motion is disabled', () => {
    ;(useReducedMotion as jest.Mock).mockReturnValue(false)

    const { container } = render(
      <PageTransition>
        <div>Content</div>
      </PageTransition>
    )

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveAttribute('data-motion', 'true')
  })

  it('renders plain div when reduced motion is enabled', () => {
    ;(useReducedMotion as jest.Mock).mockReturnValue(true)

    const { container } = render(
      <PageTransition>
        <div>Content</div>
      </PageTransition>
    )

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).not.toHaveAttribute('data-motion')
  })

  it('respects user reduced motion preference', () => {
    ;(useReducedMotion as jest.Mock).mockReturnValue(true)

    const { container } = render(
      <PageTransition className="test-class">
        <div>Content</div>
      </PageTransition>
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
      <PageTransition className="shared-class">
        <div>Motion Content</div>
      </PageTransition>
    )
    expect(motionContainer.firstChild).toHaveClass('shared-class')

    // Test with motion disabled
    ;(useReducedMotion as jest.Mock).mockReturnValue(true)
    const { container: plainContainer } = render(
      <PageTransition className="shared-class">
        <div>Plain Content</div>
      </PageTransition>
    )
    expect(plainContainer.firstChild).toHaveClass('shared-class')
  })

  it('handles undefined className', () => {
    const { container } = render(
      <PageTransition>
        <div>Content</div>
      </PageTransition>
    )

    expect(container.firstChild).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('handles complex page content structures', () => {
    render(
      <PageTransition>
        <div>
          <header>
            <h1>Page Title</h1>
            <nav>Navigation</nav>
          </header>
          <main>
            <section>Section 1</section>
            <section>Section 2</section>
          </main>
          <footer>Footer</footer>
        </div>
      </PageTransition>
    )

    expect(screen.getByText('Page Title')).toBeInTheDocument()
    expect(screen.getByText('Navigation')).toBeInTheDocument()
    expect(screen.getByText('Section 1')).toBeInTheDocument()
    expect(screen.getByText('Section 2')).toBeInTheDocument()
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })

  it('preserves interactive elements within children', () => {
    const handleClick = jest.fn()

    render(
      <PageTransition>
        <div>
          <button onClick={handleClick}>Interactive Button</button>
          <a href="/test">Link</a>
        </div>
      </PageTransition>
    )

    const button = screen.getByText('Interactive Button')
    button.click()

    expect(handleClick).toHaveBeenCalledTimes(1)
    expect(screen.getByText('Link')).toBeInTheDocument()
  })

  it('supports nested page content', () => {
    render(
      <PageTransition>
        <div>
          <div>
            <div>
              <p>Deeply nested content</p>
            </div>
          </div>
        </div>
      </PageTransition>
    )

    expect(screen.getByText('Deeply nested content')).toBeInTheDocument()
  })

  it('works with various child elements', () => {
    render(
      <PageTransition>
        <>
          <h1>Title</h1>
          <p>Description</p>
          <ul>
            <li>Item</li>
          </ul>
        </>
      </PageTransition>
    )

    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Description')).toBeInTheDocument()
    expect(screen.getByText('Item')).toBeInTheDocument()
  })
})
