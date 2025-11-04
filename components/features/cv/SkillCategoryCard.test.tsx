import { render, screen, fireEvent } from '@testing-library/react'
import type { PropsWithChildren } from 'react'
import SkillCategoryCard, { type SkillCategoryCardProps } from './SkillCategoryCard'

type MockCardHoverProps = PropsWithChildren<{ className?: string }>

// Mock CardHover component
jest.mock('@/components/animations/CardHover', () => {
  return function MockCardHover({ children, className }: MockCardHoverProps) {
    return <div className={className}>{children}</div>
  }
})

describe('SkillCategoryCard', () => {
  const mockSkills = ['React', 'TypeScript', 'Next.js', 'Node.js']

  it('renders category title', () => {
    const props: SkillCategoryCardProps = {
      category: 'Frontend',
      skills: mockSkills,
    }

    render(<SkillCategoryCard {...props} />)

    expect(screen.getByText('Frontend')).toBeInTheDocument()
  })

  it('renders all skills as buttons', () => {
    const props: SkillCategoryCardProps = {
      category: 'Frontend',
      skills: mockSkills,
    }

    render(<SkillCategoryCard {...props} />)

    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.getByText('Next.js')).toBeInTheDocument()
    expect(screen.getByText('Node.js')).toBeInTheDocument()
  })

  it('renders correct number of skill buttons', () => {
    const props: SkillCategoryCardProps = {
      category: 'Frontend',
      skills: mockSkills,
    }

    render(<SkillCategoryCard {...props} />)

    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(4)
  })

  it('applies inactive styles when skill is not active', () => {
    const props: SkillCategoryCardProps = {
      category: 'Frontend',
      skills: mockSkills,
      activeSkills: new Set(),
    }

    render(<SkillCategoryCard {...props} />)

    const reactButton = screen.getByText('React')
    expect(reactButton).toHaveClass('bg-neutral-surface', 'border-divider', 'text-text')
    expect(reactButton).not.toHaveClass('bg-accent-warm', 'text-white', 'border-accent-warm')
  })

  it('applies active styles when skill is active', () => {
    const props: SkillCategoryCardProps = {
      category: 'Frontend',
      skills: mockSkills,
      activeSkills: new Set(['React']),
    }

    render(<SkillCategoryCard {...props} />)

    const reactButton = screen.getByText('React')
    expect(reactButton).toHaveClass('bg-accent-warm', 'text-white', 'border-accent-warm')
    expect(reactButton).not.toHaveClass('bg-neutral-surface')
  })

  it('calls onSkillClick when skill is clicked', () => {
    const handleSkillClick = jest.fn()
    const props: SkillCategoryCardProps = {
      category: 'Frontend',
      skills: mockSkills,
      onSkillClick: handleSkillClick,
    }

    render(<SkillCategoryCard {...props} />)

    const reactButton = screen.getByText('React')
    fireEvent.click(reactButton)

    expect(handleSkillClick).toHaveBeenCalledWith('React')
  })

  it('calls onSkillClick with correct skill name', () => {
    const handleSkillClick = jest.fn()
    const props: SkillCategoryCardProps = {
      category: 'Frontend',
      skills: mockSkills,
      onSkillClick: handleSkillClick,
    }

    render(<SkillCategoryCard {...props} />)

    const typescriptButton = screen.getByText('TypeScript')
    fireEvent.click(typescriptButton)

    expect(handleSkillClick).toHaveBeenCalledWith('TypeScript')
    expect(handleSkillClick).toHaveBeenCalledTimes(1)
  })

  it('does not call onSkillClick when no handler is provided', () => {
    const props: SkillCategoryCardProps = {
      category: 'Frontend',
      skills: mockSkills,
    }

    render(<SkillCategoryCard {...props} />)

    const reactButton = screen.getByText('React')
    fireEvent.click(reactButton)

    // No error should be thrown
    expect(reactButton).toBeInTheDocument()
  })

  it('disables button when no click handler is provided', () => {
    const props: SkillCategoryCardProps = {
      category: 'Frontend',
      skills: mockSkills,
    }

    render(<SkillCategoryCard {...props} />)

    const reactButton = screen.getByText('React')
    expect(reactButton).toBeDisabled()
  })

  it('enables button when click handler is provided', () => {
    const handleSkillClick = jest.fn()
    const props: SkillCategoryCardProps = {
      category: 'Frontend',
      skills: mockSkills,
      onSkillClick: handleSkillClick,
    }

    render(<SkillCategoryCard {...props} />)

    const reactButton = screen.getByText('React')
    expect(reactButton).not.toBeDisabled()
  })

  it('applies cursor-pointer class when clickable', () => {
    const handleSkillClick = jest.fn()
    const props: SkillCategoryCardProps = {
      category: 'Frontend',
      skills: mockSkills,
      onSkillClick: handleSkillClick,
    }

    render(<SkillCategoryCard {...props} />)

    const reactButton = screen.getByText('React')
    expect(reactButton).toHaveClass('cursor-pointer')
  })

  it('applies cursor-default class when not clickable', () => {
    const props: SkillCategoryCardProps = {
      category: 'Frontend',
      skills: mockSkills,
    }

    render(<SkillCategoryCard {...props} />)

    const reactButton = screen.getByText('React')
    expect(reactButton).toHaveClass('cursor-default')
  })

  it('handles multiple active skills', () => {
    const props: SkillCategoryCardProps = {
      category: 'Frontend',
      skills: mockSkills,
      activeSkills: new Set(['React', 'TypeScript', 'Next.js']),
    }

    render(<SkillCategoryCard {...props} />)

    const reactButton = screen.getByText('React')
    const typescriptButton = screen.getByText('TypeScript')
    const nextButton = screen.getByText('Next.js')
    const nodeButton = screen.getByText('Node.js')

    expect(reactButton).toHaveClass('bg-accent-warm')
    expect(typescriptButton).toHaveClass('bg-accent-warm')
    expect(nextButton).toHaveClass('bg-accent-warm')
    expect(nodeButton).not.toHaveClass('bg-accent-warm')
  })

  it('renders with empty skills array', () => {
    const props: SkillCategoryCardProps = {
      category: 'Empty Category',
      skills: [],
    }

    render(<SkillCategoryCard {...props} />)

    expect(screen.getByText('Empty Category')).toBeInTheDocument()
    expect(screen.queryAllByRole('button')).toHaveLength(0)
  })

  it('applies transition classes to skill buttons', () => {
    const props: SkillCategoryCardProps = {
      category: 'Frontend',
      skills: ['React'],
    }

    render(<SkillCategoryCard {...props} />)

    const reactButton = screen.getByText('React')
    expect(reactButton).toHaveClass('transition-all', 'duration-200')
  })

  it('applies correct border and padding styles to skill buttons', () => {
    const props: SkillCategoryCardProps = {
      category: 'Frontend',
      skills: ['React'],
    }

    render(<SkillCategoryCard {...props} />)

    const reactButton = screen.getByText('React')
    expect(reactButton).toHaveClass('text-sm', 'px-3', 'py-1', 'rounded-full', 'border')
  })

  it('wraps CardHover component with card class', () => {
    const props: SkillCategoryCardProps = {
      category: 'Frontend',
      skills: mockSkills,
    }

    const { container } = render(<SkillCategoryCard {...props} />)

    // CardHover should be the wrapper with card class
    const cardElement = container.querySelector('.card')
    expect(cardElement).toBeInTheDocument()
  })
})
