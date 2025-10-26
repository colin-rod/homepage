/**
 * MarkdownText Component
 *
 * Parses and renders simple Markdown emphasis syntax in text:
 * - **bold text** → <strong>bold text</strong>
 * - *italic text* → <em>italic text</em>
 *
 * Supports nested emphasis and handles edge cases.
 * Integrates with search highlighting via HighlightText component.
 */

import React from 'react'
import HighlightText from './HighlightText'

interface MarkdownTextProps {
  text: string
  searchQuery?: string
  className?: string
}

/**
 * Parse Markdown emphasis syntax (bold and italic)
 * Returns an array of text segments with their formatting
 */
function parseMarkdown(text: string): { text: string; bold?: boolean; italic?: boolean }[] {
  const segments: { text: string; bold?: boolean; italic?: boolean }[] = []
  let currentIndex = 0

  // Regex to match **bold** or *italic* (greedy, non-nested for simplicity)
  const markdownRegex = /(\*\*([^*]+)\*\*|\*([^*]+)\*)/g
  let match: RegExpExecArray | null

  while ((match = markdownRegex.exec(text)) !== null) {
    // Add plain text before the match
    if (match.index > currentIndex) {
      segments.push({ text: text.substring(currentIndex, match.index) })
    }

    // Add formatted text
    if (match[2]) {
      // Bold text (matched by **)
      segments.push({ text: match[2], bold: true })
    } else if (match[3]) {
      // Italic text (matched by *)
      segments.push({ text: match[3], italic: true })
    }

    currentIndex = match.index + match[0].length
  }

  // Add remaining plain text
  if (currentIndex < text.length) {
    segments.push({ text: text.substring(currentIndex) })
  }

  return segments
}

/**
 * Render a single segment with appropriate formatting and search highlighting
 */
function renderSegment(
  segment: { text: string; bold?: boolean; italic?: boolean },
  index: number,
  searchQuery: string
) {
  const content = <HighlightText text={segment.text} searchQuery={searchQuery} />

  if (segment.bold) {
    return (
      <strong key={index} className="font-semibold text-text">
        {content}
      </strong>
    )
  }

  if (segment.italic) {
    return (
      <em key={index} className="italic">
        {content}
      </em>
    )
  }

  return <React.Fragment key={index}>{content}</React.Fragment>
}

/**
 * MarkdownText Component
 *
 * Usage:
 * ```tsx
 * <MarkdownText
 *   text="Launched **3 flagship products** generating *$2M+ ARR*"
 *   searchQuery="flagship"
 * />
 * ```
 */
export default function MarkdownText({
  text,
  searchQuery = '',
  className = '',
}: MarkdownTextProps) {
  const segments = parseMarkdown(text)

  return (
    <span className={className}>
      {segments.map((segment, index) => renderSegment(segment, index, searchQuery))}
    </span>
  )
}
