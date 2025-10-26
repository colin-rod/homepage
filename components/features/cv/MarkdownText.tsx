'use client'

/**
 * MarkdownText Component
 *
 * Parses and renders simple Markdown syntax in text:
 * - **bold text** → <strong>bold text</strong>
 * - *italic text* → <em>italic text</em>
 * - [link text](url) → <a href="url">link text</a>
 *
 * Supports nested emphasis and handles edge cases.
 * Integrates with search highlighting via HighlightText component.
 */

import React from 'react'
import Link from 'next/link'
import { usePostHog } from 'posthog-js/react'
import HighlightText from './HighlightText'

interface MarkdownTextProps {
  text: string
  searchQuery?: string
  className?: string
  trackingContext?: {
    roleId?: string
    company?: string
  }
}

type MarkdownSegment = {
  text: string
  bold?: boolean
  italic?: boolean
  link?: { url: string; text: string }
}

/**
 * Parse Markdown syntax (bold, italic, and links)
 * Returns an array of text segments with their formatting
 */
function parseMarkdown(text: string): MarkdownSegment[] {
  const segments: MarkdownSegment[] = []
  let currentIndex = 0

  // Regex to match [link text](url), **bold**, or *italic*
  // Order matters: links first, then bold (2 asterisks), then italic (1 asterisk)
  // Use negative lookahead/lookbehind to prevent matching asterisks within links
  const markdownRegex = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+?)\*\*|\*([^*]+?)\*/g
  let match: RegExpExecArray | null

  while ((match = markdownRegex.exec(text)) !== null) {
    // Add plain text before the match
    if (match.index > currentIndex) {
      segments.push({ text: text.substring(currentIndex, match.index) })
    }

    // Add formatted text based on which group matched
    if (match[1] && match[2]) {
      // Link (matched by [text](url))
      segments.push({ text: '', link: { text: match[1], url: match[2] } })
    } else if (match[3]) {
      // Bold text (matched by **)
      segments.push({ text: match[3], bold: true })
    } else if (match[4]) {
      // Italic text (matched by *)
      segments.push({ text: match[4], italic: true })
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
  segment: MarkdownSegment,
  index: number,
  searchQuery: string,
  posthog: ReturnType<typeof usePostHog> | undefined,
  trackingContext?: { roleId?: string; company?: string }
) {
  // Handle links
  if (segment.link) {
    const { text, url } = segment.link
    const isInternalLink = url.startsWith('/')

    // Extract project slug from URL for tracking
    const projectSlug = isInternalLink ? url.split('/').pop() : null

    const handleLinkClick = (e: React.MouseEvent) => {
      e.stopPropagation() // Prevent card expansion

      // Track project link click
      if (posthog && projectSlug) {
        posthog.capture('cv_project_link_clicked', {
          project_slug: projectSlug,
          project_name: text,
          role_id: trackingContext?.roleId,
          company: trackingContext?.company,
          url: url,
        })
      }
    }

    if (isInternalLink) {
      return (
        <Link
          key={index}
          href={url}
          className="text-accent-warm hover:underline hover:text-accent-warm/80 transition-colors duration-200 inline-flex items-center gap-1"
          onClick={handleLinkClick}
        >
          <HighlightText text={text} searchQuery={searchQuery} />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-3 h-3 opacity-60 hover:opacity-100 transition-opacity"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      )
    } else {
      // External link
      return (
        <a
          key={index}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-warm hover:underline hover:text-accent-warm/80 transition-colors duration-200 inline-flex items-center gap-1"
          onClick={handleLinkClick}
        >
          <HighlightText text={text} searchQuery={searchQuery} />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-3 h-3 opacity-60 hover:opacity-100 transition-opacity"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z"
              clipRule="evenodd"
            />
            <path
              fillRule="evenodd"
              d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z"
              clipRule="evenodd"
            />
          </svg>
        </a>
      )
    }
  }

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
 * <MarkdownText
 *   text="[BabyPool](/projects/babypool) - Collaborative app for families"
 *   trackingContext={{ roleId: 'independent-pm-dev-2024', company: 'Independent' }}
 * />
 * ```
 */
export default function MarkdownText({
  text,
  searchQuery = '',
  className = '',
  trackingContext,
}: MarkdownTextProps) {
  const posthog = usePostHog()
  const segments = parseMarkdown(text)

  return (
    <span className={className}>
      {segments.map((segment, index) =>
        renderSegment(segment, index, searchQuery, posthog, trackingContext)
      )}
    </span>
  )
}
