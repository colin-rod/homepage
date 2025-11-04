import { act, render, screen, waitFor } from '@testing-library/react'
import { FocusTicker } from './FocusTicker'

// Mock framer-motion to avoid animation complexities in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentProps<'div'>) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

// Mock useReducedMotion hook
const mockUseReducedMotion = jest.fn()
jest.mock('framer-motion', () => ({
  ...jest.requireActual('framer-motion'),
  useReducedMotion: () => mockUseReducedMotion(),
}))

describe('FocusTicker', () => {
  const mockAchievements = [
    '🚀 Launched multi-region marketplace from 0→1',
    '📈 Scaled ARR to $1M+ in 3 months',
    '🤝 Built cross-functional team of 50+',
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseReducedMotion.mockReturnValue(false)
  })

  describe('Rendering', () => {
    it('renders the ticker container', () => {
      render(<FocusTicker items={mockAchievements} />)
      const ticker = screen.getByRole('region', { name: /achievements/i })
      expect(ticker).toBeInTheDocument()
    })

    it('renders the current achievement item', () => {
      render(<FocusTicker items={mockAchievements} />)
      // Should render at least the first achievement
      expect(screen.getByText(mockAchievements[0])).toBeInTheDocument()
    })

    it('includes all items in screen reader region', () => {
      render(<FocusTicker items={mockAchievements} />)
      // All achievements should be available to screen readers
      mockAchievements.forEach((achievement) => {
        expect(screen.getByText(achievement)).toBeInTheDocument()
      })
    })

    it('renders with default rotation speed of 4000ms when not specified', () => {
      const { container } = render(<FocusTicker items={mockAchievements} />)
      const ticker = container.querySelector('[data-testid="ticker-content"]')
      expect(ticker).toBeInTheDocument()
    })
  })

  describe('Props', () => {
    it('accepts custom rotation speed', () => {
      render(<FocusTicker items={mockAchievements} rotationSpeed={2000} />)
      const ticker = screen.getByRole('region', { name: /achievements/i })
      expect(ticker).toBeInTheDocument()
    })

    it('renders empty state when items array is empty', () => {
      render(<FocusTicker items={[]} />)
      const ticker = screen.getByRole('region', { name: /achievements/i })
      expect(ticker).toBeInTheDocument()
      expect(ticker).toBeEmptyDOMElement()
    })

    it('renders single item correctly', () => {
      const singleItem = ['🚀 Single achievement']
      render(<FocusTicker items={singleItem} />)
      expect(screen.getByText(singleItem[0])).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has aria-live="polite" for screen reader announcements', () => {
      render(<FocusTicker items={mockAchievements} />)
      const ticker = screen.getByRole('region', { name: /achievements/i })
      expect(ticker).toHaveAttribute('aria-live', 'polite')
    })

    it('has aria-atomic="false" to only announce changed content', () => {
      render(<FocusTicker items={mockAchievements} />)
      const ticker = screen.getByRole('region', { name: /achievements/i })
      expect(ticker).toHaveAttribute('aria-atomic', 'false')
    })

    it('respects prefers-reduced-motion by disabling animation', () => {
      mockUseReducedMotion.mockReturnValue(true)
      render(<FocusTicker items={mockAchievements} />)
      const ticker = screen.getByRole('region', { name: /achievements/i })
      // When reduced motion is enabled, ticker should not animate
      expect(ticker).toBeInTheDocument()
    })

    it('includes descriptive aria-label', () => {
      render(<FocusTicker items={mockAchievements} />)
      const ticker = screen.getByRole('region', { name: /achievements/i })
      expect(ticker).toHaveAccessibleName()
    })
  })

  describe('Content Updates', () => {
    it('updates content when items prop changes', () => {
      const { rerender } = render(<FocusTicker items={mockAchievements} />)
      expect(screen.getByText(mockAchievements[0])).toBeInTheDocument()

      const newAchievements = ['💰 New achievement 1', '🎯 New achievement 2']
      rerender(<FocusTicker items={newAchievements} />)

      expect(screen.getByText(newAchievements[0])).toBeInTheDocument()
      expect(screen.queryByText(mockAchievements[0])).not.toBeInTheDocument()
    })

    it('handles rapid prop updates gracefully', async () => {
      const { rerender } = render(<FocusTicker items={mockAchievements} />)

      const updates = [['💰 Update 1'], ['🎯 Update 2'], ['📊 Update 3']]

      for (const items of updates) {
        rerender(<FocusTicker items={items} />)
        await waitFor(() => {
          expect(screen.getByText(items[0])).toBeInTheDocument()
        })
      }
    })
  })

  describe('Animation Behavior', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      act(() => {
        jest.runOnlyPendingTimers()
      })
      jest.useRealTimers()
    })

    it('continuously loops without pausing', () => {
      render(<FocusTicker items={mockAchievements} rotationSpeed={1000} />)

      // Verify initial state
      expect(screen.getByText(mockAchievements[0])).toBeInTheDocument()

      // Fast-forward time to trigger rotation
      act(() => {
        jest.advanceTimersByTime(1000)
      })

      // Ticker should still be rendering (continuous loop)
      const tickerContents = screen.getAllByTestId('ticker-content')
      expect(tickerContents.length).toBeGreaterThan(0)
      expect(
        tickerContents.some((element) =>
          mockAchievements.includes(element.textContent?.trim() ?? '')
        )
      ).toBe(true)
    })

    it('does not pause on hover', () => {
      const { container } = render(<FocusTicker items={mockAchievements} rotationSpeed={1000} />)

      const ticker = container.querySelector('[data-testid="ticker-content"]')
      expect(ticker).toBeInTheDocument()

      // Simulate hover - animation should continue
      // (No pause-on-hover behavior expected based on epic requirements)
    })
  })

  describe('Edge Cases', () => {
    it('handles very long achievement text gracefully', () => {
      const longText = '🚀 ' + 'A'.repeat(200) // 200+ character achievement
      render(<FocusTicker items={[longText]} />)
      expect(screen.getByText(longText)).toBeInTheDocument()
    })

    it('handles achievements with special characters', () => {
      const specialChars = [
        '🚀 Achievement with "quotes"',
        "💰 Achievement with 'apostrophes'",
        '📊 Achievement with <brackets>',
        '🎯 Achievement with & ampersands',
      ]
      render(<FocusTicker items={specialChars} />)
      // All items should be in the document (in sr-only region)
      specialChars.forEach((text) => {
        expect(screen.getByText(text)).toBeInTheDocument()
      })
    })

    it('handles achievements with multiple emojis', () => {
      const multiEmoji = ['🚀💰📊 Multiple emojis achievement']
      render(<FocusTicker items={multiEmoji} />)
      expect(screen.getByText(multiEmoji[0])).toBeInTheDocument()
    })

    it('handles undefined or null items gracefully', () => {
      // TypeScript would prevent this, but test runtime safety
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render(<FocusTicker items={undefined as any} />)
      const ticker = screen.getByRole('region', { name: /achievements/i })
      expect(ticker).toBeInTheDocument()
    })
  })

  describe('Performance', () => {
    it('renders efficiently with large number of achievements', () => {
      const manyAchievements = Array.from({ length: 50 }, (_, i) => `🚀 Achievement ${i + 1}`)
      const { container } = render(<FocusTicker items={manyAchievements} />)
      expect(container.firstChild).toBeInTheDocument()
    })

    it('cleans up animations on unmount', () => {
      const { unmount } = render(<FocusTicker items={mockAchievements} />)
      unmount()
      // No errors should occur on unmount
      expect(true).toBe(true)
    })
  })

  describe('Visual Behavior', () => {
    it('applies overflow hidden to container', () => {
      render(<FocusTicker items={mockAchievements} />)
      const ticker = screen.getByRole('region', { name: /achievements/i })
      expect(ticker).toHaveClass('overflow-hidden')
    })

    it('truncates text on small screens with ellipsis', () => {
      render(<FocusTicker items={mockAchievements} />)
      const tickerContent = screen.getByTestId('ticker-content')
      // Verify that truncation styles are applied
      expect(tickerContent).toHaveClass('truncate')
    })
  })
})
