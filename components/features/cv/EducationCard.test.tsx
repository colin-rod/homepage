import { render, screen } from '@testing-library/react'
import type { PropsWithChildren } from 'react'
import EducationCard, { type EducationCardProps } from './EducationCard'

type MockCardHoverProps = PropsWithChildren<{ className?: string }>

// Mock CardHover component
jest.mock('@/components/animations/CardHover', () => {
  return function MockCardHover({ children, className }: MockCardHoverProps) {
    return <div className={className}>{children}</div>
  }
})

describe('EducationCard', () => {
  it('renders degree', () => {
    const props: EducationCardProps = {
      degree: 'Bachelor of Science in Computer Science',
      institution: 'University of California',
      year: 2020,
    }

    render(<EducationCard {...props} />)

    expect(screen.getByText('Bachelor of Science in Computer Science')).toBeInTheDocument()
  })

  it('renders institution', () => {
    const props: EducationCardProps = {
      degree: 'Master of Business Administration',
      institution: 'Harvard Business School',
      year: 2022,
    }

    render(<EducationCard {...props} />)

    expect(screen.getByText('Harvard Business School')).toBeInTheDocument()
  })

  it('renders year', () => {
    const props: EducationCardProps = {
      degree: 'PhD in Economics',
      institution: 'MIT',
      year: 2018,
    }

    render(<EducationCard {...props} />)

    expect(screen.getByText('2018')).toBeInTheDocument()
  })

  it('renders location when provided', () => {
    const props: EducationCardProps = {
      degree: 'Bachelor of Arts',
      institution: 'Oxford University',
      year: 2019,
      location: 'Oxford, UK',
    }

    render(<EducationCard {...props} />)

    expect(screen.getByText(/Oxford, UK/)).toBeInTheDocument()
  })

  it('displays institution and location with bullet separator', () => {
    const props: EducationCardProps = {
      degree: 'Master of Science',
      institution: 'Stanford University',
      year: 2021,
      location: 'Stanford, CA',
    }

    render(<EducationCard {...props} />)

    expect(screen.getByText('Stanford University • Stanford, CA')).toBeInTheDocument()
  })

  it('does not render bullet when location is not provided', () => {
    const props: EducationCardProps = {
      degree: 'Bachelor of Engineering',
      institution: 'Georgia Tech',
      year: 2017,
    }

    render(<EducationCard {...props} />)

    expect(screen.getByText('Georgia Tech')).toBeInTheDocument()
    expect(screen.queryByText(/•/)).not.toBeInTheDocument()
  })

  it('renders description when provided', () => {
    const props: EducationCardProps = {
      degree: 'Bachelor of Science',
      institution: 'University of Michigan',
      year: 2020,
      description: 'Focus on machine learning and artificial intelligence',
    }

    render(<EducationCard {...props} />)

    expect(
      screen.getByText('Focus on machine learning and artificial intelligence')
    ).toBeInTheDocument()
  })

  it('does not render description when not provided', () => {
    const props: EducationCardProps = {
      degree: 'Master of Arts',
      institution: 'Columbia University',
      year: 2019,
    }

    const { container } = render(<EducationCard {...props} />)

    // Should only have degree, institution, and year text nodes
    const paragraphs = container.querySelectorAll('p')
    expect(paragraphs).toHaveLength(2) // Institution+location line and year line
  })

  it('applies correct CSS classes to degree heading', () => {
    const props: EducationCardProps = {
      degree: 'Doctorate',
      institution: 'Yale',
      year: 2016,
    }

    render(<EducationCard {...props} />)

    const heading = screen.getByText('Doctorate')
    expect(heading.tagName).toBe('H3')
    expect(heading).toHaveClass('text-xl', 'font-bold', 'text-primary', 'mb-1')
  })

  it('applies correct CSS classes to institution text', () => {
    const props: EducationCardProps = {
      degree: 'Bachelor',
      institution: 'Princeton',
      year: 2015,
    }

    render(<EducationCard {...props} />)

    const institutionText = screen.getByText('Princeton')
    expect(institutionText.tagName).toBe('P')
    expect(institutionText).toHaveClass('text-lg', 'text-text-secondary', 'mb-2')
  })

  it('applies correct CSS classes to year text', () => {
    const props: EducationCardProps = {
      degree: 'Master',
      institution: 'Duke',
      year: 2020,
    }

    const { container } = render(<EducationCard {...props} />)

    const yearText = container.querySelector('p.text-sm')
    expect(yearText).toBeInTheDocument()
    expect(yearText).toHaveClass('text-sm', 'text-text-secondary')
  })

  it('applies correct CSS classes to description text', () => {
    const props: EducationCardProps = {
      degree: 'PhD',
      institution: 'Cornell',
      year: 2018,
      description: 'Research in quantum computing',
    }

    render(<EducationCard {...props} />)

    const description = screen.getByText('Research in quantum computing')
    expect(description.tagName).toBe('P')
    expect(description).toHaveClass('text-text-secondary', 'mt-3')
  })

  it('wraps content in CardHover with card class', () => {
    const props: EducationCardProps = {
      degree: 'Bachelor',
      institution: 'NYU',
      year: 2019,
    }

    const { container } = render(<EducationCard {...props} />)

    const cardElement = container.querySelector('.card')
    expect(cardElement).toBeInTheDocument()
  })

  it('renders all props together correctly', () => {
    const props: EducationCardProps = {
      degree: 'Master of Business Administration',
      institution: 'Wharton School',
      year: 2023,
      location: 'Philadelphia, PA',
      description: 'Specialization in Finance and Entrepreneurship',
    }

    render(<EducationCard {...props} />)

    expect(screen.getByText('Master of Business Administration')).toBeInTheDocument()
    expect(screen.getByText('Wharton School • Philadelphia, PA')).toBeInTheDocument()
    expect(screen.getByText('2023')).toBeInTheDocument()
    expect(screen.getByText('Specialization in Finance and Entrepreneurship')).toBeInTheDocument()
  })

  it('handles long degree names', () => {
    const props: EducationCardProps = {
      degree:
        'Master of Science in Computer Science with Specialization in Artificial Intelligence',
      institution: 'Carnegie Mellon University',
      year: 2021,
    }

    render(<EducationCard {...props} />)

    expect(
      screen.getByText(
        'Master of Science in Computer Science with Specialization in Artificial Intelligence'
      )
    ).toBeInTheDocument()
  })

  it('handles long institution names', () => {
    const props: EducationCardProps = {
      degree: 'Bachelor of Arts',
      institution: 'University of California, Los Angeles (UCLA)',
      year: 2019,
    }

    render(<EducationCard {...props} />)

    expect(screen.getByText('University of California, Los Angeles (UCLA)')).toBeInTheDocument()
  })
})
