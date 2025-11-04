import { render, screen } from '@testing-library/react'
import HighlightText from './HighlightText'

describe('HighlightText', () => {
  describe('Rendering', () => {
    it('renders text without highlighting when no search query', () => {
      render(<HighlightText text="Hello World" searchQuery="" />)
      expect(screen.getByText('Hello World')).toBeInTheDocument()
    })

    it('renders text without highlighting when search query is whitespace', () => {
      render(<HighlightText text="Hello World" searchQuery="   " />)
      expect(screen.getByText('Hello World')).toBeInTheDocument()
    })

    it('renders text as plain when no match found', () => {
      const { container } = render(<HighlightText text="Hello World" searchQuery="xyz" />)
      const marks = container.querySelectorAll('mark')
      expect(marks.length).toBe(0)
    })
  })

  describe('Text Highlighting', () => {
    it('highlights exact match', () => {
      const { container } = render(<HighlightText text="Hello World" searchQuery="Hello" />)
      const mark = container.querySelector('mark')
      expect(mark).toBeInTheDocument()
      expect(mark).toHaveTextContent('Hello')
    })

    it('highlights case-insensitive match', () => {
      const { container } = render(<HighlightText text="Hello World" searchQuery="hello" />)
      const mark = container.querySelector('mark')
      expect(mark).toBeInTheDocument()
      expect(mark).toHaveTextContent('Hello')
    })

    it('highlights multiple occurrences', () => {
      const { container } = render(
        <HighlightText text="React is great and React is fun" searchQuery="React" />
      )
      const marks = container.querySelectorAll('mark')
      expect(marks.length).toBe(2)
      marks.forEach((mark) => {
        expect(mark).toHaveTextContent('React')
      })
    })

    it('highlights partial word match', () => {
      const { container } = render(<HighlightText text="Product Manager" searchQuery="Product" />)
      const mark = container.querySelector('mark')
      expect(mark).toBeInTheDocument()
      expect(mark).toHaveTextContent('Product')
    })

    it('highlights substring within word', () => {
      const { container } = render(<HighlightText text="JavaScript" searchQuery="Script" />)
      const mark = container.querySelector('mark')
      expect(mark).toBeInTheDocument()
      expect(mark).toHaveTextContent('Script')
    })

    it('preserves case of original text in highlight', () => {
      const { container } = render(<HighlightText text="JavaScript" searchQuery="javascript" />)
      const mark = container.querySelector('mark')
      expect(mark).toHaveTextContent('JavaScript')
    })
  })

  describe('Special Characters', () => {
    it('handles special regex characters in search query', () => {
      const { container } = render(
        <HighlightText text="Cost is $100 (approx.)" searchQuery="$100" />
      )
      const mark = container.querySelector('mark')
      expect(mark).toBeInTheDocument()
      expect(mark).toHaveTextContent('$100')
    })

    it('handles parentheses in search query', () => {
      const { container } = render(
        <HighlightText text="Cost is $100 (approx.)" searchQuery="(approx.)" />
      )
      const mark = container.querySelector('mark')
      expect(mark).toBeInTheDocument()
      expect(mark).toHaveTextContent('(approx.)')
    })

    it('handles square brackets in search query', () => {
      const { container } = render(<HighlightText text="Array [1, 2, 3]" searchQuery="[1, 2, 3]" />)
      const mark = container.querySelector('mark')
      expect(mark).toBeInTheDocument()
      expect(mark).toHaveTextContent('[1, 2, 3]')
    })

    it('handles asterisk in search query', () => {
      const { container } = render(<HighlightText text="Note: * required" searchQuery="*" />)
      const mark = container.querySelector('mark')
      expect(mark).toBeInTheDocument()
      expect(mark).toHaveTextContent('*')
    })

    it('handles plus sign in search query', () => {
      const { container } = render(<HighlightText text="Growth: +50%" searchQuery="+50%" />)
      const mark = container.querySelector('mark')
      expect(mark).toBeInTheDocument()
      expect(mark).toHaveTextContent('+50%')
    })

    it('handles backslash in search query', () => {
      const { container } = render(<HighlightText text="Path: C:\\Users" searchQuery="C:\\" />)
      const mark = container.querySelector('mark')
      expect(mark).toBeInTheDocument()
    })

    it('handles dot in search query', () => {
      const { container } = render(
        <HighlightText text="Email: test@example.com" searchQuery=".com" />
      )
      const mark = container.querySelector('mark')
      expect(mark).toBeInTheDocument()
      expect(mark).toHaveTextContent('.com')
    })
  })

  describe('Styling', () => {
    it('applies correct styling classes to highlighted text', () => {
      const { container } = render(<HighlightText text="Hello World" searchQuery="Hello" />)
      const mark = container.querySelector('mark')
      expect(mark).toHaveClass('bg-accent-warm/20')
      expect(mark).toHaveClass('text-accent-warm')
      expect(mark).toHaveClass('font-medium')
      expect(mark).toHaveClass('px-0.5')
      expect(mark).toHaveClass('rounded')
    })

    it('uses mark element for semantic highlighting', () => {
      const { container } = render(<HighlightText text="Hello World" searchQuery="Hello" />)
      const mark = container.querySelector('mark')
      expect(mark?.tagName).toBe('MARK')
    })
  })

  describe('Edge Cases', () => {
    it('handles empty text', () => {
      render(<HighlightText text="" searchQuery="test" />)
      // Should render without error
    })

    it('handles single character search', () => {
      const { container } = render(<HighlightText text="Hello World" searchQuery="e" />)
      const marks = container.querySelectorAll('mark')
      expect(marks.length).toBe(1)
      expect(marks[0]).toHaveTextContent('e')
    })

    it('handles very long text', () => {
      const longText = 'a'.repeat(1000) + 'match' + 'b'.repeat(1000)
      const { container } = render(<HighlightText text={longText} searchQuery="match" />)
      const mark = container.querySelector('mark')
      expect(mark).toHaveTextContent('match')
    })

    it('handles text with only whitespace', () => {
      render(<HighlightText text="   " searchQuery="test" />)
      // Should render without error
    })

    it('handles unicode characters', () => {
      const { container } = render(<HighlightText text="Hello 世界 🌍" searchQuery="世界" />)
      const mark = container.querySelector('mark')
      expect(mark).toHaveTextContent('世界')
    })

    it('handles emoji in text', () => {
      const { container } = render(<HighlightText text="Increased by 50% 📈" searchQuery="50%" />)
      const mark = container.querySelector('mark')
      expect(mark).toHaveTextContent('50%')
    })

    it('handles newlines in text', () => {
      const { container } = render(
        <HighlightText text="Line 1\nLine 2\nLine 3" searchQuery="Line 2" />
      )
      const mark = container.querySelector('mark')
      expect(mark).toHaveTextContent('Line 2')
    })
  })

  describe('Performance', () => {
    it('handles multiple rapid renders', () => {
      const { rerender } = render(<HighlightText text="Hello World" searchQuery="Hello" />)
      rerender(<HighlightText text="Hello World" searchQuery="World" />)
      rerender(<HighlightText text="Hello World" searchQuery="Hello" />)
      // Should not throw errors
    })

    it('handles search query changes', () => {
      const { rerender, container } = render(
        <HighlightText text="Hello World" searchQuery="Hello" />
      )

      let mark = container.querySelector('mark')
      expect(mark).toHaveTextContent('Hello')

      rerender(<HighlightText text="Hello World" searchQuery="World" />)
      mark = container.querySelector('mark')
      expect(mark).toHaveTextContent('World')
    })
  })

  describe('Text Splitting', () => {
    it('preserves non-matching text', () => {
      const { container } = render(<HighlightText text="Hello World" searchQuery="World" />)
      const mark = container.querySelector('mark')
      expect(mark).toHaveTextContent('World')
      // Check that non-matching text exists
      expect(container.textContent).toContain('Hello ')
    })

    it('splits text correctly with match at start', () => {
      const { container } = render(<HighlightText text="Hello World" searchQuery="Hello" />)
      const mark = container.querySelector('mark')
      expect(mark).toHaveTextContent('Hello')
      expect(container.textContent).toBe('Hello World')
    })

    it('splits text correctly with match at end', () => {
      const { container } = render(<HighlightText text="Hello World" searchQuery="World" />)
      const mark = container.querySelector('mark')
      expect(mark).toHaveTextContent('World')
      expect(container.textContent).toBe('Hello World')
    })

    it('splits text correctly with match in middle', () => {
      const { container } = render(<HighlightText text="Hello World Test" searchQuery="World" />)
      const mark = container.querySelector('mark')
      expect(mark).toHaveTextContent('World')
      expect(container.textContent).toBe('Hello World Test')
    })
  })

  describe('Multiple Words', () => {
    it('highlights multi-word phrase', () => {
      const { container } = render(
        <HighlightText text="Product Manager Role" searchQuery="Product Manager" />
      )
      const mark = container.querySelector('mark')
      expect(mark).toHaveTextContent('Product Manager')
    })

    it('handles spaces in search query', () => {
      const { container } = render(
        <HighlightText text="Senior Product Manager" searchQuery="Product Manager" />
      )
      const mark = container.querySelector('mark')
      expect(mark).toHaveTextContent('Product Manager')
    })
  })
})
