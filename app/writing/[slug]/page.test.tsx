/**
 * Tests for Individual Blog Post Page
 */

import { render, screen } from '@testing-library/react'
import BlogPostPage from './page'
import * as blogUtils from '@/lib/blog'

// Mock the blog utilities
jest.mock('@/lib/blog')
const mockedBlogUtils = blogUtils as jest.Mocked<typeof blogUtils>

// Mock next/navigation
jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}))

// Mock next-mdx-remote/rsc
jest.mock('next-mdx-remote/rsc', () => ({
  MDXRemote: ({ source }: { source: string }) => <div data-testid="mdx-content">{source}</div>,
}))

describe('Blog Post Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders blog post title', async () => {
    mockedBlogUtils.getPostBySlug.mockReturnValue({
      slug: 'test-post',
      title: 'My Test Post',
      date: '2025-01-15',
      summary: 'A test post',
      tags: ['tech'],
      content: '# Hello\n\nThis is content.',
      readingTime: 5,
    })

    const params = Promise.resolve({ slug: 'test-post' })
    const page = await BlogPostPage({ params })
    render(page)

    expect(screen.getByRole('heading', { name: 'My Test Post', level: 1 })).toBeInTheDocument()
  })

  it('displays post metadata (date and reading time)', async () => {
    mockedBlogUtils.getPostBySlug.mockReturnValue({
      slug: 'test-post',
      title: 'Test Post',
      date: '2025-01-15',
      summary: 'A test',
      tags: ['tech'],
      content: 'Content',
      readingTime: 5,
    })

    const params = Promise.resolve({ slug: 'test-post' })
    const page = await BlogPostPage({ params })
    render(page)

    expect(screen.getByText(/Jan.*15.*2025/i)).toBeInTheDocument()
    expect(screen.getByText(/5.*min.*read/i)).toBeInTheDocument()
  })

  it('displays post tags', async () => {
    mockedBlogUtils.getPostBySlug.mockReturnValue({
      slug: 'test-post',
      title: 'Test Post',
      date: '2025-01-15',
      summary: 'A test',
      tags: ['product', 'strategy', 'tech'],
      content: 'Content',
      readingTime: 5,
    })

    const params = Promise.resolve({ slug: 'test-post' })
    const page = await BlogPostPage({ params })
    render(page)

    expect(screen.getByText('product')).toBeInTheDocument()
    expect(screen.getByText('strategy')).toBeInTheDocument()
    expect(screen.getByText('tech')).toBeInTheDocument()
  })

  it('renders back to writing links', async () => {
    mockedBlogUtils.getPostBySlug.mockReturnValue({
      slug: 'test-post',
      title: 'Test Post',
      date: '2025-01-15',
      summary: 'A test',
      tags: [],
      content: 'Content',
      readingTime: 5,
    })

    const params = Promise.resolve({ slug: 'test-post' })
    const page = await BlogPostPage({ params })
    render(page)

    const backLinks = screen.getAllByRole('link', { name: /back to writing/i })
    expect(backLinks.length).toBeGreaterThanOrEqual(1)
    backLinks.forEach(link => {
      expect(link).toHaveAttribute('href', '/writing')
    })
  })

  it('renders MDX content in prose format', async () => {
    mockedBlogUtils.getPostBySlug.mockReturnValue({
      slug: 'test-post',
      title: 'Test Post',
      date: '2025-01-15',
      summary: 'A test',
      tags: [],
      content: '# Heading\n\nParagraph content here.\n\n## Subheading',
      readingTime: 2,
    })

    const params = Promise.resolve({ slug: 'test-post' })
    const page = await BlogPostPage({ params })
    render(page)

    // Content should be rendered in a prose container
    const article = screen.getByRole('article')
    expect(article).toHaveClass('prose')
  })
})
