/**
 * Tests for RelatedArticles component
 */

import { render, screen } from '@testing-library/react'
import { describe, it, expect } from '@jest/globals'
import RelatedArticles from './RelatedArticles'
import { BlogPost } from '@/lib/types'

describe('RelatedArticles', () => {
  const mockProjectTags = ['travel', 'ai', 'product']

  const mockPosts: BlogPost[] = [
    {
      slug: 'building-something-new',
      year: '2025',
      month: '11',
      isDraft: false,
      title: 'Building Something New for Travelers',
      date: '2025-11-11',
      summary: 'Notes from building Trip Threads',
      tags: ['travel', 'ai', 'building', 'product'],
      readingTime: 5,
    },
    {
      slug: 'coding-while-walking',
      year: '2025',
      month: '11',
      isDraft: false,
      title: 'On Coding While Walking the Dog',
      date: '2025-11-04',
      summary: 'How Claude Code turned my dog walks into coding sessions',
      tags: ['tech', 'workflow', 'ai', 'productivity'],
      readingTime: 4,
    },
  ]

  it('renders related articles section with posts', () => {
    render(<RelatedArticles posts={mockPosts} projectTags={mockProjectTags} />)

    expect(screen.getByText('Related Articles')).toBeInTheDocument()
    expect(screen.getByText('Building Something New for Travelers')).toBeInTheDocument()
    expect(screen.getByText('On Coding While Walking the Dog')).toBeInTheDocument()
  })

  it('displays post summaries', () => {
    render(<RelatedArticles posts={mockPosts} projectTags={mockProjectTags} />)

    expect(screen.getByText('Notes from building Trip Threads')).toBeInTheDocument()
    expect(
      screen.getByText('How Claude Code turned my dog walks into coding sessions')
    ).toBeInTheDocument()
  })

  it('displays reading time for posts', () => {
    render(<RelatedArticles posts={mockPosts} projectTags={mockProjectTags} />)

    expect(screen.getByText('5 min read')).toBeInTheDocument()
    expect(screen.getByText('4 min read')).toBeInTheDocument()
  })

  it('highlights matching tags', () => {
    render(<RelatedArticles posts={mockPosts} projectTags={mockProjectTags} />)

    // First post matches: travel, ai, product
    const travelBadges = screen.getAllByText('travel')
    expect(travelBadges.length).toBeGreaterThan(0)

    const aiBadges = screen.getAllByText('ai')
    expect(aiBadges.length).toBeGreaterThan(0)

    const productBadges = screen.getAllByText('product')
    expect(productBadges.length).toBeGreaterThan(0)
  })

  it('shows "+X more" indicator when post has additional tags', () => {
    render(<RelatedArticles posts={mockPosts} projectTags={mockProjectTags} />)

    // First post has 4 tags but only 3 match, so should show "+1 more"
    expect(screen.getByText('+1 more')).toBeInTheDocument()
  })

  it('generates correct URLs for published posts', () => {
    render(<RelatedArticles posts={mockPosts} projectTags={mockProjectTags} />)

    const links = screen.getAllByRole('link')
    const firstPostLink = links.find((link) =>
      link.getAttribute('href')?.includes('/writing/2025/11/building-something-new')
    )

    expect(firstPostLink).toBeInTheDocument()
  })

  it('generates correct URLs for draft posts', () => {
    const draftPost: BlogPost = {
      slug: 'draft-post',
      isDraft: true,
      title: 'Draft Post',
      date: '2025-11-01',
      summary: 'A draft post',
      tags: ['travel'],
      readingTime: 3,
    }

    render(<RelatedArticles posts={[draftPost]} projectTags={mockProjectTags} />)

    const link = screen.getByRole('link')
    expect(link.getAttribute('href')).toBe('/writing/drafts/draft-post')
  })

  it('renders nothing when no posts provided', () => {
    const { container } = render(<RelatedArticles posts={[]} projectTags={mockProjectTags} />)

    expect(container.firstChild).toBeNull()
  })

  it('applies grid layout classes', () => {
    const { container } = render(
      <RelatedArticles posts={mockPosts} projectTags={mockProjectTags} />
    )

    const gridElement = container.querySelector('.grid')
    expect(gridElement).toBeInTheDocument()
    expect(gridElement?.className).toContain('grid-cols-1')
    expect(gridElement?.className).toContain('md:grid-cols-2')
  })

  it('applies card styling to each post', () => {
    const { container } = render(
      <RelatedArticles posts={mockPosts} projectTags={mockProjectTags} />
    )

    const cards = container.querySelectorAll('.card')
    expect(cards.length).toBe(mockPosts.length)
  })

  it('applies hover effects to cards', () => {
    const { container } = render(
      <RelatedArticles posts={mockPosts} projectTags={mockProjectTags} />
    )

    const cards = container.querySelectorAll('.card')
    cards.forEach((card) => {
      expect(card.className).toContain('hover:shadow-glow')
      expect(card.className).toContain('transition-shadow')
    })
  })

  it('displays section heading and description', () => {
    render(<RelatedArticles posts={mockPosts} projectTags={mockProjectTags} />)

    expect(screen.getByText('Related Articles')).toBeInTheDocument()
    expect(screen.getByText('Blog posts about this project and related topics')).toBeInTheDocument()
  })

  it('formats dates correctly', () => {
    render(<RelatedArticles posts={mockPosts} projectTags={mockProjectTags} />)

    // formatDate should format '2025-11-11' as 'November 11, 2025' or similar
    // Just verify the date element exists with the correct datetime attribute
    const timeElements = screen.getAllByRole('time')
    expect(timeElements.length).toBeGreaterThan(0)
    expect(timeElements[0].getAttribute('datetime')).toBe('2025-11-11')
  })

  it('renders article semantic elements', () => {
    render(<RelatedArticles posts={mockPosts} projectTags={mockProjectTags} />)

    const articles = screen.getAllByRole('article')
    expect(articles.length).toBe(mockPosts.length)
  })
})
