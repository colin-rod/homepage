/**
 * Tests for Reflections Index Page
 */

import { render, screen } from '@testing-library/react'
import WritingPage from './page'
import * as blogUtils from '@/lib/blog'

// Mock the blog utilities
jest.mock('@/lib/blog')
const mockedBlogUtils = blogUtils as jest.Mocked<typeof blogUtils>

describe('Reflections Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders page heading', () => {
    mockedBlogUtils.getAllPosts.mockReturnValue([])

    render(<WritingPage />)

    expect(screen.getByRole('heading', { name: /reflections/i, level: 1 })).toBeInTheDocument()
  })

  it('displays introduction text', () => {
    mockedBlogUtils.getAllPosts.mockReturnValue([])

    render(<WritingPage />)

    expect(
      screen.getByText(/thoughts on product development, strategy, and technology/i)
    ).toBeInTheDocument()
  })

  it('renders list of blog posts', () => {
    mockedBlogUtils.getAllPosts.mockReturnValue([
      {
        slug: 'first-post',
        title: 'My First Post',
        date: '2025-01-15',
        summary: 'This is my first post',
        tags: ['product', 'tech'],
        readingTime: 5,
      },
      {
        slug: 'second-post',
        title: 'My Second Post',
        date: '2025-01-10',
        summary: 'This is my second post',
        tags: ['strategy'],
        readingTime: 3,
      },
    ])

    render(<WritingPage />)

    expect(screen.getByText('My First Post')).toBeInTheDocument()
    expect(screen.getByText('My Second Post')).toBeInTheDocument()
    expect(screen.getByText('This is my first post')).toBeInTheDocument()
    expect(screen.getByText('This is my second post')).toBeInTheDocument()
  })

  it('displays post metadata (date and reading time)', () => {
    mockedBlogUtils.getAllPosts.mockReturnValue([
      {
        slug: 'test-post',
        title: 'Test Post',
        date: '2025-01-15',
        summary: 'A test post',
        tags: ['tech'],
        readingTime: 5,
      },
    ])

    render(<WritingPage />)

    expect(screen.getByText(/Jan.*15.*2025/i)).toBeInTheDocument()
    expect(screen.getByText(/5.*min.*read/i)).toBeInTheDocument()
  })

  it('displays post tags', () => {
    mockedBlogUtils.getAllPosts.mockReturnValue([
      {
        slug: 'test-post',
        title: 'Test Post',
        date: '2025-01-15',
        summary: 'A test post',
        tags: ['product', 'strategy'],
        readingTime: 5,
      },
    ])

    render(<WritingPage />)

    expect(screen.getByText('product')).toBeInTheDocument()
    expect(screen.getByText('strategy')).toBeInTheDocument()
  })

  it('renders links to individual blog posts', () => {
    mockedBlogUtils.getAllPosts.mockReturnValue([
      {
        slug: 'test-post',
        title: 'Test Post',
        date: '2025-01-15',
        summary: 'A test post',
        tags: ['tech'],
        readingTime: 5,
      },
    ])

    render(<WritingPage />)

    const link = screen.getByRole('link', { name: /test post/i })
    expect(link).toHaveAttribute('href', '/writing/test-post')
  })

  it('shows empty state when no posts exist', () => {
    mockedBlogUtils.getAllPosts.mockReturnValue([])

    render(<WritingPage />)

    expect(screen.getByText(/no posts yet/i)).toBeInTheDocument()
  })

  it('sorts posts by date (newest first)', () => {
    mockedBlogUtils.getAllPosts.mockReturnValue([
      {
        slug: 'new-post',
        title: 'New Post',
        date: '2025-01-20',
        summary: 'Newest',
        tags: [],
        readingTime: 1,
      },
      {
        slug: 'old-post',
        title: 'Old Post',
        date: '2024-12-01',
        summary: 'Oldest',
        tags: [],
        readingTime: 1,
      },
    ])

    render(<WritingPage />)

    const posts = screen.getAllByRole('article')
    expect(posts[0]).toHaveTextContent('New Post')
    expect(posts[1]).toHaveTextContent('Old Post')
  })
})
