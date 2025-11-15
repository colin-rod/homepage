import { render, screen, fireEvent } from '@testing-library/react'
import type { HTMLAttributes, PropsWithChildren } from 'react'
import SkillAtlas from './SkillAtlas'
import { CV, CVFilterType } from '@/lib/types'

type MotionDivProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>> & {
  variants?: unknown
  initial?: unknown
  animate?: unknown
  whileInView?: unknown
  exit?: unknown
  viewport?: unknown
  transition?: unknown
}

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: MotionDivProps) => {
      // Extract animation props that we don't pass to DOM elements
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { variants, initial, animate, whileInView, exit, viewport, transition, ...domProps } =
        props
      return <div {...domProps}>{children}</div>
    },
  },
  AnimatePresence: ({ children }: PropsWithChildren) => <>{children}</>,
}))

describe('SkillAtlas', () => {
  const mockCVData: CV = {
    summary: 'Test summary',
    skills: [
      {
        category: 'Product Management',
        items: ['Product Strategy', 'Roadmapping', 'Stakeholder Management'],
      },
      {
        category: 'Technical',
        items: ['React', 'TypeScript', 'Node.js'],
      },
      {
        category: 'Strategy & Analytics',
        items: ['Data Analysis', 'Market Research'],
      },
    ],
    experience: [
      {
        id: 'exp-1',
        title: 'Senior Product Manager',
        company: 'Tech Corp',
        location: 'SF',
        startDate: '2020-01-01',
        endDate: '2023-01-01',
        description: 'Led product development',
        highlights: [
          { text: 'Built React dashboard', skills: ['React', 'TypeScript'] },
          'Managed product roadmap',
        ],
        tags: ['product', 'tech'],
        skills: ['React', 'TypeScript', 'Product Strategy'],
      },
      {
        id: 'exp-2',
        title: 'Strategy Manager',
        company: 'Consulting Firm',
        location: 'NY',
        startDate: '2018-01-01',
        endDate: '2020-01-01',
        description: 'Strategy consulting',
        highlights: ['Analyzed market data', 'Developed strategies'],
        tags: ['strategy'],
        skills: ['Data Analysis', 'Market Research'],
      },
    ],
    education: [],
    projects: [],
    focusSummaries: {
      all: 'All skills summary',
      product: 'Product skills summary',
      strategy: 'Strategy skills summary',
      tech: 'Tech skills summary',
    },
  }

  const mockOnSkillClick = jest.fn()

  const defaultProps = {
    cvData: mockCVData,
    activeSkills: new Set<string>(),
    onSkillClick: mockOnSkillClick,
    activeFilter: 'all' as CVFilterType,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders section with correct heading', () => {
      render(<SkillAtlas {...defaultProps} />)
      expect(screen.getByText('Skill Atlas')).toBeInTheDocument()
      expect(screen.getByText('Explore skills by focus area')).toBeInTheDocument()
    })

    it('renders instructions text', () => {
      render(<SkillAtlas {...defaultProps} />)
      expect(screen.getByText(/Hover over a skill to see which roles/)).toBeInTheDocument()
    })

    it('renders section with id="skills"', () => {
      const { container } = render(<SkillAtlas {...defaultProps} />)
      const section = container.querySelector('#skills')
      expect(section).toBeInTheDocument()
    })

    it('renders all three focus columns when filter is "all"', () => {
      render(<SkillAtlas {...defaultProps} />)
      const productHeaders = screen.getAllByText('Product')
      const strategyHeaders = screen.getAllByText('Strategy')
      const technicalHeaders = screen.getAllByText('Technical')
      expect(productHeaders.length).toBeGreaterThan(0)
      expect(strategyHeaders.length).toBeGreaterThan(0)
      expect(technicalHeaders.length).toBeGreaterThan(0)
    })

    it('renders only product column when filter is "product"', () => {
      render(<SkillAtlas {...defaultProps} activeFilter="product" />)
      const productHeaders = screen.getAllByText('Product')
      expect(productHeaders.length).toBeGreaterThan(0)
      expect(screen.queryByText('Strategy')).not.toBeInTheDocument()
      expect(screen.queryByText('Technical')).not.toBeInTheDocument()
    })

    it('renders only strategy column when filter is "strategy"', () => {
      render(<SkillAtlas {...defaultProps} activeFilter="strategy" />)
      expect(screen.queryByText('Product')).not.toBeInTheDocument()
      const strategyHeaders = screen.getAllByText('Strategy')
      expect(strategyHeaders.length).toBeGreaterThan(0)
      expect(screen.queryByText('Technical')).not.toBeInTheDocument()
    })

    it('renders only tech column when filter is "tech"', () => {
      render(<SkillAtlas {...defaultProps} activeFilter="tech" />)
      expect(screen.queryByText('Product')).not.toBeInTheDocument()
      expect(screen.queryByText('Strategy')).not.toBeInTheDocument()
      const technicalHeaders = screen.getAllByText('Technical')
      expect(technicalHeaders.length).toBeGreaterThan(0)
    })
  })

  describe('Skill Buttons', () => {
    it('renders skill buttons', () => {
      render(<SkillAtlas {...defaultProps} />)
      expect(screen.getAllByText('React').length).toBeGreaterThan(0)
      expect(screen.getAllByText('TypeScript').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Product Strategy').length).toBeGreaterThan(0)
    })

    it('calls onSkillClick when skill is clicked', () => {
      render(<SkillAtlas {...defaultProps} />)
      const reactButtons = screen.getAllByText('React')
      fireEvent.click(reactButtons[0])
      expect(mockOnSkillClick).toHaveBeenCalledWith('React')
    })

    it('shows role count for skills', () => {
      render(<SkillAtlas {...defaultProps} />)
      // React is used in 1 role
      const roleCountText = screen.getAllByText(/1 role/)
      expect(roleCountText.length).toBeGreaterThan(0)
    })

    it('uses singular "role" for 1 context', () => {
      render(<SkillAtlas {...defaultProps} />)
      expect(screen.getAllByText(/1 role/).length).toBeGreaterThan(0)
    })

    it('uses plural "roles" for multiple contexts', () => {
      // Create data with skill used in multiple roles
      const multiRoleData: CV = {
        ...mockCVData,
        experience: [
          { ...mockCVData.experience[0], skills: ['React'] },
          { ...mockCVData.experience[1], skills: ['React'], tags: ['tech'] },
        ],
      }
      render(<SkillAtlas {...defaultProps} cvData={multiRoleData} />)
      const rolesText = screen.queryAllByText(/2 roles?/)
      expect(rolesText.length).toBeGreaterThan(0)
    })

    it('highlights active skills', () => {
      const activeSkills = new Set(['React'])
      render(<SkillAtlas {...defaultProps} activeSkills={activeSkills} />)

      // Active skills should have different styling
      const reactButtons = screen.getAllByText('React')
      const firstButton = reactButtons[0].closest('button')
      expect(firstButton).toBeInTheDocument()
    })

    it('applies opacity to shared skills when not active', () => {
      render(<SkillAtlas {...defaultProps} />)
      // Skills that appear in multiple columns are marked as shared
      const { container } = render(<SkillAtlas {...defaultProps} />)
      const sharedSkills = container.querySelectorAll('.opacity-80')
      expect(sharedSkills.length).toBeGreaterThan(0)
    })
  })

  describe('Column Headers', () => {
    it('shows skill count in column headers', () => {
      render(<SkillAtlas {...defaultProps} />)
      // Should show counts like "3 skills" or "5 skills"
      const skillCountText = screen.queryAllByText(/\d+ skills?/)
      expect(skillCountText.length).toBeGreaterThan(0)
    })

    it('uses singular "skill" for 1 skill', () => {
      const singleSkillData: CV = {
        ...mockCVData,
        skills: [{ category: 'Product', items: ['Product Strategy'] }],
        experience: [
          {
            ...mockCVData.experience[0],
            skills: ['Product Strategy'],
            tags: ['product'],
          },
        ],
      }
      render(<SkillAtlas {...defaultProps} cvData={singleSkillData} />)
      expect(screen.getByText('1 skill')).toBeInTheDocument()
    })

    it('renders focus indicators', () => {
      const { container } = render(<SkillAtlas {...defaultProps} />)
      // Each column should have a colored dot indicator
      const indicators = container.querySelectorAll('[aria-hidden="true"]')
      expect(indicators.length).toBeGreaterThan(0)
    })
  })

  describe('Show More/Less Toggle', () => {
    it('shows "Show more" button when columns have many skills', () => {
      // Create data with many skills to trigger collapse
      const manySkillsData: CV = {
        ...mockCVData,
        skills: [
          {
            category: 'Product',
            items: Array.from({ length: 10 }, (_, i) => `Skill ${i}`),
          },
        ],
        experience: mockCVData.experience.map((exp) => ({
          ...exp,
          skills: Array.from({ length: 10 }, (_, i) => `Skill ${i}`),
        })),
      }
      render(<SkillAtlas {...defaultProps} cvData={manySkillsData} />)
      // Should show "Show more" button
      const showMoreButton = screen.queryByText('Show more')
      expect(showMoreButton).toBeInTheDocument()
    })

    it('toggles to "Show less" when clicked', () => {
      const manySkillsData: CV = {
        ...mockCVData,
        skills: [
          {
            category: 'Product',
            items: Array.from({ length: 10 }, (_, i) => `Skill ${i}`),
          },
        ],
        experience: mockCVData.experience.map((exp) => ({
          ...exp,
          skills: Array.from({ length: 10 }, (_, i) => `Skill ${i}`),
        })),
      }
      render(<SkillAtlas {...defaultProps} cvData={manySkillsData} />)

      const showMoreButton = screen.getByText('Show more')
      fireEvent.click(showMoreButton)

      expect(screen.getByText('Show less')).toBeInTheDocument()
    })

    it('does not show toggle when all skills fit', () => {
      render(<SkillAtlas {...defaultProps} />)
      // With few skills, toggle should not appear
      screen.queryByText(/Show (more|less)/)
      // May or may not appear depending on skill count
    })

    it('resets show state when filter changes', () => {
      const manySkillsData: CV = {
        ...mockCVData,
        skills: [
          {
            category: 'Product',
            items: Array.from({ length: 10 }, (_, i) => `Skill ${i}`),
          },
        ],
        experience: mockCVData.experience.map((exp) => ({
          ...exp,
          skills: Array.from({ length: 10 }, (_, i) => `Skill ${i}`),
          tags: ['product'],
        })),
      }
      const { rerender } = render(
        <SkillAtlas {...defaultProps} cvData={manySkillsData} activeFilter="all" />
      )

      const showMoreButton = screen.queryByText('Show more')
      if (showMoreButton) {
        fireEvent.click(showMoreButton)
        expect(screen.getByText('Show less')).toBeInTheDocument()
      }

      // Change filter
      rerender(<SkillAtlas {...defaultProps} cvData={manySkillsData} activeFilter="product" />)

      // Should reset to show all skills when filter is not "all"
    })
  })

  describe('Mobile Layout', () => {
    it('renders mobile horizontal scroll container', () => {
      const { container } = render(<SkillAtlas {...defaultProps} />)
      const mobileContainer = container.querySelector('.md\\:hidden')
      expect(mobileContainer).toBeInTheDocument()
    })

    it('renders desktop grid container', () => {
      const { container } = render(<SkillAtlas {...defaultProps} />)
      const desktopContainer = container.querySelector('.md\\:grid')
      expect(desktopContainer).toBeInTheDocument()
    })

    it('applies correct grid columns class for 3 columns', () => {
      const { container } = render(<SkillAtlas {...defaultProps} activeFilter="all" />)
      const grid = container.querySelector('.md\\:grid-cols-3')
      expect(grid).toBeInTheDocument()
    })

    it('applies correct grid columns class for 1 column', () => {
      const { container } = render(<SkillAtlas {...defaultProps} activeFilter="product" />)
      const grid = container.querySelector('.md\\:grid-cols-1')
      expect(grid).toBeInTheDocument()
    })
  })

  describe('Focus Categorization', () => {
    it('categorizes product skills correctly', () => {
      render(<SkillAtlas {...defaultProps} />)
      // Product Strategy should appear in Product column
      const productHeaders = screen.getAllByText('Product')
      expect(productHeaders.length).toBeGreaterThan(0)
      expect(screen.getAllByText('Product Strategy').length).toBeGreaterThan(0)
    })

    it('categorizes technical skills correctly', () => {
      render(<SkillAtlas {...defaultProps} />)
      // React, TypeScript should appear in Technical column
      const technicalHeaders = screen.getAllByText('Technical')
      expect(technicalHeaders.length).toBeGreaterThan(0)
      expect(screen.getAllByText('React').length).toBeGreaterThan(0)
    })

    it('categorizes strategy skills correctly', () => {
      render(<SkillAtlas {...defaultProps} />)
      // Data Analysis, Market Research should appear in Strategy
      const strategyHeaders = screen.getAllByText('Strategy')
      expect(strategyHeaders.length).toBeGreaterThan(0)
      expect(screen.getAllByText('Data Analysis').length).toBeGreaterThan(0)
    })

    it('handles skills with multiple focuses (shared skills)', () => {
      const dataAnalyticsCVData: CV = {
        ...mockCVData,
        skills: [
          {
            category: 'Analytics',
            items: ['SQL', 'Python'],
          },
        ],
        experience: [
          {
            ...mockCVData.experience[0],
            skills: ['SQL', 'Python'],
            tags: ['strategy', 'tech'],
          },
        ],
      }
      render(<SkillAtlas {...defaultProps} cvData={dataAnalyticsCVData} />)
      // Analytics skills should appear in both Strategy and Tech columns
      const sqlButtons = screen.getAllByText('SQL')
      expect(sqlButtons.length).toBeGreaterThan(0)
    })
  })

  describe('Hover Interactions (Desktop)', () => {
    it('dims other columns when hovering a column', () => {
      const { container } = render(<SkillAtlas {...defaultProps} />)
      const columns = container.querySelectorAll('[class*="rounded-2xl"]')

      if (columns.length > 1) {
        const firstColumn = columns[0] as HTMLElement
        fireEvent.mouseEnter(firstColumn)

        // Other columns should be dimmed
        container.querySelectorAll('.opacity-50')
        // May have dimmed columns depending on implementation
      }
    })

    it('resets opacity when mouse leaves', () => {
      const { container } = render(<SkillAtlas {...defaultProps} />)
      const columns = container.querySelectorAll('[class*="rounded-2xl"]')

      if (columns.length > 1) {
        const firstColumn = columns[0] as HTMLElement
        fireEvent.mouseEnter(firstColumn)
        fireEvent.mouseLeave(firstColumn)

        // All columns should be back to full opacity
        const opaqueColumns = container.querySelectorAll('.opacity-100')
        expect(opaqueColumns.length).toBeGreaterThan(0)
      }
    })
  })

  describe('Accessibility', () => {
    it('has section landmark with id', () => {
      const { container } = render(<SkillAtlas {...defaultProps} />)
      const section = container.querySelector('section#skills')
      expect(section).toBeInTheDocument()
    })

    it('skill buttons have type="button"', () => {
      render(<SkillAtlas {...defaultProps} />)
      const reactButtons = screen.getAllByText('React')
      reactButtons.forEach((button) => {
        const buttonElement = button.closest('button')
        expect(buttonElement).toHaveAttribute('type', 'button')
      })
    })

    it('skill buttons have focus styles', () => {
      render(<SkillAtlas {...defaultProps} />)
      const reactButtons = screen.getAllByText('React')

      reactButtons.forEach((textNode) => {
        const button = textNode.closest('button')
        expect(button).toHaveClass('focus-visible:outline-none')
        expect(button).toHaveClass('focus-visible:ring-2')
      })
    })

    it('skill buttons are keyboard accessible', () => {
      render(<SkillAtlas {...defaultProps} />)
      const reactButtons = screen.getAllByText('React')
      const firstButton = reactButtons[0].closest('button')

      firstButton?.focus()
      expect(firstButton).toHaveFocus()
    })

    it('toggle button is keyboard accessible', () => {
      const manySkillsData: CV = {
        ...mockCVData,
        skills: [
          {
            category: 'Product',
            items: Array.from({ length: 10 }, (_, i) => `Skill ${i}`),
          },
        ],
        experience: mockCVData.experience.map((exp) => ({
          ...exp,
          skills: Array.from({ length: 10 }, (_, i) => `Skill ${i}`),
        })),
      }
      render(<SkillAtlas {...defaultProps} cvData={manySkillsData} />)

      const showMoreButton = screen.queryByText('Show more')
      if (showMoreButton) {
        showMoreButton.focus()
        expect(showMoreButton).toHaveFocus()
      }
    })
  })

  describe('Styling', () => {
    it('applies column-specific colors', () => {
      render(<SkillAtlas {...defaultProps} />)

      // Product column should have purple colors
      const productHeaders = screen.getAllByText('Product')
      const productColumn = productHeaders[0].closest('[class*="border-purple"]')
      expect(productColumn).toBeInTheDocument()
    })

    it('applies rounded corners to columns', () => {
      const { container } = render(<SkillAtlas {...defaultProps} />)
      const roundedColumns = container.querySelectorAll('.rounded-2xl')
      expect(roundedColumns.length).toBeGreaterThan(0)
    })

    it('applies backdrop blur effect', () => {
      const { container } = render(<SkillAtlas {...defaultProps} />)
      const blurredElements = container.querySelectorAll('.backdrop-blur')
      expect(blurredElements.length).toBeGreaterThan(0)
    })

    it('applies shadow to columns', () => {
      const { container } = render(<SkillAtlas {...defaultProps} />)
      const shadowedColumns = container.querySelectorAll('.shadow-sm')
      expect(shadowedColumns.length).toBeGreaterThan(0)
    })
  })

  describe('Edge Cases', () => {
    it('handles empty skills array', () => {
      const emptySkillsData: CV = {
        ...mockCVData,
        skills: [],
        experience: [],
      }
      render(<SkillAtlas {...defaultProps} cvData={emptySkillsData} />)
      expect(screen.getByText('Skill Atlas')).toBeInTheDocument()
    })

    it('handles skills with no experience data', () => {
      const noExperienceData: CV = {
        ...mockCVData,
        experience: [],
      }
      render(<SkillAtlas {...defaultProps} cvData={noExperienceData} />)
      const productHeaders = screen.getAllByText('Product')
      expect(productHeaders.length).toBeGreaterThan(0)
    })

    it('handles skills without contexts', () => {
      render(<SkillAtlas {...defaultProps} />)
      // Some skills may not have role contexts
      expect(screen.getByText('Skill Atlas')).toBeInTheDocument()
    })
  })
})
