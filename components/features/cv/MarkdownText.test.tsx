import { render, screen } from '@testing-library/react'
import MarkdownText from './MarkdownText'

// Mock HighlightText component
jest.mock('./HighlightText', () => ({
  __esModule: true,
  default: ({ text }: { text: string }) => <span>{text}</span>,
}))

describe('MarkdownText', () => {
  describe('Bold text', () => {
    it('renders bold text with ** syntax', () => {
      render(<MarkdownText text="This is **bold text** here" />)
      const boldElement = screen.getByText('bold text')
      expect(boldElement.tagName).toBe('STRONG')
      expect(boldElement).toHaveClass('font-semibold', 'text-text')
    })

    it('renders multiple bold segments', () => {
      render(<MarkdownText text="**First bold** and **second bold**" />)
      const boldElements = screen.getAllByText(/bold/)
      expect(boldElements).toHaveLength(2)
      expect(boldElements[0].tagName).toBe('STRONG')
      expect(boldElements[1].tagName).toBe('STRONG')
    })

    it('handles bold text at start of string', () => {
      render(<MarkdownText text="**Bold start** normal text" />)
      expect(screen.getByText('Bold start').tagName).toBe('STRONG')
    })

    it('handles bold text at end of string', () => {
      render(<MarkdownText text="Normal text **bold end**" />)
      expect(screen.getByText('bold end').tagName).toBe('STRONG')
    })
  })

  describe('Italic text', () => {
    it('renders italic text with * syntax', () => {
      render(<MarkdownText text="This is *italic text* here" />)
      const italicElement = screen.getByText('italic text')
      expect(italicElement.tagName).toBe('EM')
      expect(italicElement).toHaveClass('italic')
    })

    it('renders multiple italic segments', () => {
      render(<MarkdownText text="*First italic* and *second italic*" />)
      const italicElements = screen.getAllByText(/italic/)
      expect(italicElements).toHaveLength(2)
      expect(italicElements[0].tagName).toBe('EM')
      expect(italicElements[1].tagName).toBe('EM')
    })
  })

  describe('Mixed formatting', () => {
    it('renders both bold and italic in same text', () => {
      render(<MarkdownText text="**Bold** and *italic* text" />)
      expect(screen.getByText('Bold').tagName).toBe('STRONG')
      expect(screen.getByText('italic').tagName).toBe('EM')
    })

    it('handles complex mixed formatting', () => {
      render(<MarkdownText text="Normal **bold** normal *italic* **bold again**" />)
      const boldElements = screen.getAllByText(/bold/)
      const italicElement = screen.getByText('italic')
      expect(boldElements).toHaveLength(2)
      expect(italicElement.tagName).toBe('EM')
    })
  })

  describe('Plain text', () => {
    it('renders plain text without formatting', () => {
      const { container } = render(<MarkdownText text="Just plain text" />)
      expect(container.querySelector('strong')).toBeNull()
      expect(container.querySelector('em')).toBeNull()
      expect(screen.getByText('Just plain text')).toBeInTheDocument()
    })

    it('renders empty string', () => {
      const { container } = render(<MarkdownText text="" />)
      expect(container.querySelector('span')).toBeInTheDocument()
    })
  })

  describe('Edge cases', () => {
    it('handles incomplete markdown syntax', () => {
      render(<MarkdownText text="This has **incomplete bold" />)
      // Should render as plain text since markdown is incomplete
      expect(screen.getByText(/incomplete bold/)).toBeInTheDocument()
    })

    it('handles single asterisk as plain text', () => {
      render(<MarkdownText text="This * is plain" />)
      expect(screen.getByText(/\*/)).toBeInTheDocument()
    })

    it('handles empty markdown markers', () => {
      render(<MarkdownText text="Empty ** or * markers" />)
      expect(screen.getByText(/Empty/)).toBeInTheDocument()
    })

    it('handles text with only markdown markers', () => {
      render(<MarkdownText text="**Bold**" />)
      expect(screen.getByText('Bold').tagName).toBe('STRONG')
    })
  })

  describe('Real-world CV examples', () => {
    it('renders CV highlight with metrics', () => {
      render(
        <MarkdownText text="Launched **3 flagship products** generating **$2M+ ARR** in first year" />
      )
      expect(screen.getByText('3 flagship products').tagName).toBe('STRONG')
      expect(screen.getByText('$2M+ ARR').tagName).toBe('STRONG')
    })

    it('renders team leadership highlight', () => {
      render(<MarkdownText text="Led team of **12 engineers** across *4 time zones*" />)
      expect(screen.getByText('12 engineers').tagName).toBe('STRONG')
      expect(screen.getByText('4 time zones').tagName).toBe('EM')
    })

    it('renders performance improvement highlight', () => {
      render(<MarkdownText text="Improved efficiency by **40%** reducing costs by **$700K**" />)
      const boldElements = screen.getAllByText(/40%|700K/)
      expect(boldElements).toHaveLength(2)
      expect(boldElements[0].tagName).toBe('STRONG')
      expect(boldElements[1].tagName).toBe('STRONG')
    })
  })

  describe('CSS classes', () => {
    it('applies custom className to wrapper', () => {
      const { container } = render(<MarkdownText text="Test" className="custom-class" />)
      expect(container.querySelector('.custom-class')).toBeInTheDocument()
    })

    it('applies default classes to bold text', () => {
      render(<MarkdownText text="**Bold**" />)
      const boldElement = screen.getByText('Bold')
      expect(boldElement).toHaveClass('font-semibold', 'text-text')
    })

    it('applies default classes to italic text', () => {
      render(<MarkdownText text="*Italic*" />)
      const italicElement = screen.getByText('Italic')
      expect(italicElement).toHaveClass('italic')
    })
  })

  describe('Integration with search', () => {
    it('passes searchQuery to HighlightText', () => {
      // HighlightText is mocked, but this tests the integration
      render(<MarkdownText text="**Bold** text" searchQuery="Bold" />)
      expect(screen.getByText('Bold')).toBeInTheDocument()
    })

    it('handles search with formatted text', () => {
      render(<MarkdownText text="Launched **3 products** successfully" searchQuery="products" />)
      expect(screen.getByText('3 products').tagName).toBe('STRONG')
    })
  })
})
