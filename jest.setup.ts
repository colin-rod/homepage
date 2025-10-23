// Add custom Jest DOM matchers
import '@testing-library/jest-dom'
import React from 'react'

// Mock Framer Motion to avoid animation issues in tests
jest.mock('framer-motion', () => {
  const actual = jest.requireActual('framer-motion')
  return {
    ...actual,
    motion: {
      div: React.forwardRef((props: any, ref: any) =>
        React.createElement('div', { ...props, ref })
      ),
      nav: React.forwardRef((props: any, ref: any) =>
        React.createElement('nav', { ...props, ref })
      ),
      section: React.forwardRef((props: any, ref: any) =>
        React.createElement('section', { ...props, ref })
      ),
    },
    AnimatePresence: ({ children }: any) => children,
    useReducedMotion: () => true, // Always return true to use non-animated variants in tests
  }
})
