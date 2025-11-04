import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import type { HTMLAttributes, PropsWithChildren } from 'react'
import FloatingNav from './FloatingNav'
import { usePostHog } from 'posthog-js/react'

type MotionNavProps = PropsWithChildren<HTMLAttributes<HTMLElement>>
type MotionDivProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>>

// Mock PostHog
jest.mock('posthog-js/react', () => ({
  usePostHog: jest.fn(),
}))

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    nav: ({ children, ...props }: MotionNavProps) => <nav {...props}>{children}</nav>,
    div: ({ children, ...props }: MotionDivProps) => <div {...props}>{children}</div>,
  },
}))

describe('FloatingNav', () => {
  const mockPostHog = {
    capture: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(usePostHog as jest.Mock).mockReturnValue(mockPostHog)

    // Mock DOM elements for sections
    document.body.innerHTML = `
      <div id="overview" style="height: 500px; position: absolute; top: 0;"></div>
      <div id="skills" style="height: 500px; position: absolute; top: 600px;"></div>
      <div id="experience" style="height: 500px; position: absolute; top: 1200px;"></div>
      <div id="education" style="height: 500px; position: absolute; top: 1800px;"></div>
    `

    // Mock window dimensions
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 800,
    })

    // Mock scrollY
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 0,
    })
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders all navigation sections', () => {
    render(<FloatingNav />)

    expect(screen.getByText('Overview')).toBeInTheDocument()
    expect(screen.getByText('Skills')).toBeInTheDocument()
    expect(screen.getByText('Experience')).toBeInTheDocument()
    expect(screen.getByText('Education')).toBeInTheDocument()
  })

  it('renders with correct ARIA label', () => {
    render(<FloatingNav />)

    const nav = screen.getByRole('navigation')
    expect(nav).toHaveAttribute('aria-label', 'Page navigation')
  })

  it('has first section (Overview) active by default', () => {
    render(<FloatingNav />)

    const overviewButton = screen.getByText('Overview')
    expect(overviewButton).toHaveClass('font-bold', 'text-accent-warm')
    expect(overviewButton).toHaveAttribute('aria-current', 'true')
  })

  it('marks non-active sections correctly', () => {
    render(<FloatingNav />)

    const skillsButton = screen.getByText('Skills')
    expect(skillsButton).not.toHaveClass('font-bold')
    expect(skillsButton).toHaveClass('text-text-secondary')
    expect(skillsButton).toHaveAttribute('aria-current', 'false')
  })

  it('handles click navigation and scrolls to section', async () => {
    const scrollToMock = jest.fn()
    window.scrollTo = scrollToMock

    const pushStateMock = jest.fn()
    window.history.pushState = pushStateMock

    render(<FloatingNav />)

    const skillsButton = screen.getByText('Skills')
    fireEvent.click(skillsButton)

    await waitFor(() => {
      expect(scrollToMock).toHaveBeenCalledWith({
        top: expect.any(Number),
        behavior: 'smooth',
      })
    })

    expect(pushStateMock).toHaveBeenCalledWith(null, '', '#skills')
  })

  it('tracks navigation click with PostHog', async () => {
    const scrollToMock = jest.fn()
    window.scrollTo = scrollToMock

    render(<FloatingNav />)

    const experienceButton = screen.getByText('Experience')
    fireEvent.click(experienceButton)

    await waitFor(() => {
      expect(mockPostHog.capture).toHaveBeenCalledWith('cv_floating_nav_clicked', {
        section: 'experience',
        label: 'Experience',
      })
    })
  })

  it('does not scroll when section element does not exist', () => {
    // Remove all section elements
    document.body.innerHTML = ''

    const scrollToMock = jest.fn()
    window.scrollTo = scrollToMock

    render(<FloatingNav />)

    const overviewButton = screen.getByText('Overview')
    fireEvent.click(overviewButton)

    expect(scrollToMock).not.toHaveBeenCalled()
  })

  it('updates active section on scroll', async () => {
    render(<FloatingNav />)

    // Initially Overview should be active
    expect(screen.getByText('Overview')).toHaveAttribute('aria-current', 'true')

    // Mock getBoundingClientRect for Skills section
    const skillsElement = document.getElementById('skills')!
    jest.spyOn(skillsElement, 'getBoundingClientRect').mockReturnValue({
      top: 350, // Near viewport center (400)
      height: 500,
      bottom: 850,
      left: 0,
      right: 0,
      width: 0,
      x: 0,
      y: 350,
      toJSON: () => ({}),
    })

    // Mock getBoundingClientRect for Overview (further from center)
    const overviewElement = document.getElementById('overview')!
    jest.spyOn(overviewElement, 'getBoundingClientRect').mockReturnValue({
      top: -200,
      height: 500,
      bottom: 300,
      left: 0,
      right: 0,
      width: 0,
      x: 0,
      y: -200,
      toJSON: () => ({}),
    })

    // Trigger scroll event
    fireEvent.scroll(window)

    await waitFor(() => {
      expect(screen.getByText('Skills')).toHaveAttribute('aria-current', 'true')
    })
  })

  it('calculates progress based on active section', () => {
    const { container } = render(<FloatingNav />)

    // Progress should be 25% for first section (1/4 * 100)
    // Check for the animated progress div
    const progressBar = container.querySelector('.bg-accent-warm')
    expect(progressBar).toBeInTheDocument()
  })

  it('applies correct CSS classes for visibility and positioning', () => {
    render(<FloatingNav />)

    const nav = screen.getByRole('navigation')
    expect(nav).toHaveClass('fixed', 'right-8', 'top-24', 'z-50', 'hidden', 'lg:block')
  })

  it('renders all section buttons as interactive elements', () => {
    render(<FloatingNav />)

    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(4)

    buttons.forEach((button) => {
      expect(button).toHaveClass('transition-all', 'duration-300', 'hover:text-accent-warm')
    })
  })
})
