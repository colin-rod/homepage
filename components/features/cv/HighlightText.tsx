import { useMemo } from 'react'

/**
 * HighlightText Component
 *
 * Highlights matching text within a string based on search query.
 * Used in search results to show which parts of the text matched the search.
 */

interface HighlightTextProps {
  text: string
  searchQuery: string
}

export default function HighlightText({ text, searchQuery }: HighlightTextProps) {
  // Memoize regex creation to avoid recompiling on every render
  const regex = useMemo(() => {
    if (!searchQuery.trim()) return null
    return new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  }, [searchQuery])

  if (!regex) {
    return <>{text}</>
  }

  const parts = text.split(regex)

  return (
    <>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <mark
            key={index}
            className="bg-accent-warm/20 text-accent-warm font-medium px-0.5 rounded"
          >
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  )
}
