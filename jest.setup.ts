// Add custom Jest DOM matchers
import '@testing-library/jest-dom'
import React from 'react'

// Mock Framer Motion to avoid animation issues in tests
jest.mock('framer-motion', () => {
  const actual = jest.requireActual('framer-motion')

  // Create a generic motion component factory
  const createMotionComponent = (element: string) =>
    React.forwardRef((props: any, ref: any) => React.createElement(element, { ...props, ref }))

  return {
    ...actual,
    motion: {
      div: createMotionComponent('div'),
      nav: createMotionComponent('nav'),
      section: createMotionComponent('section'),
      button: createMotionComponent('button'),
      ul: createMotionComponent('ul'),
      li: createMotionComponent('li'),
      article: createMotionComponent('article'),
      aside: createMotionComponent('aside'),
      header: createMotionComponent('header'),
      footer: createMotionComponent('footer'),
      main: createMotionComponent('main'),
    },
    AnimatePresence: ({ children }: any) => children,
    useReducedMotion: () => true, // Always return true to use non-animated variants in tests
    useInView: () => true, // Elements are always in view during tests
  }
})

// Mock lucide-react icons to avoid SSR issues in tests
jest.mock('lucide-react', () => ({
  Filter: (props: any) => React.createElement('svg', { ...props, 'data-testid': 'filter-icon' }),
  Code2: (props: any) => React.createElement('svg', { ...props, 'data-testid': 'code2-icon' }),
  X: (props: any) => React.createElement('svg', { ...props, 'data-testid': 'x-icon' }),
  Clock: (props: any) => React.createElement('svg', { ...props, 'data-testid': 'clock-icon' }),
  ChevronDown: (props: any) =>
    React.createElement('svg', { ...props, 'data-testid': 'chevron-down-icon' }),
  ChevronUp: (props: any) =>
    React.createElement('svg', { ...props, 'data-testid': 'chevron-up-icon' }),
  ChevronLeft: (props: any) =>
    React.createElement('svg', { ...props, 'data-testid': 'chevron-left-icon' }),
  ChevronRight: (props: any) =>
    React.createElement('svg', { ...props, 'data-testid': 'chevron-right-icon' }),
  Search: (props: any) => React.createElement('svg', { ...props, 'data-testid': 'search-icon' }),
  ExternalLink: (props: any) =>
    React.createElement('svg', { ...props, 'data-testid': 'external-link-icon' }),
  Github: (props: any) => React.createElement('svg', { ...props, 'data-testid': 'github-icon' }),
  FileText: (props: any) =>
    React.createElement('svg', { ...props, 'data-testid': 'file-text-icon' }),
  Rocket: (props: any) => React.createElement('svg', { ...props, 'data-testid': 'rocket-icon' }),
  Lightbulb: (props: any) =>
    React.createElement('svg', { ...props, 'data-testid': 'lightbulb-icon' }),
  Archive: (props: any) => React.createElement('svg', { ...props, 'data-testid': 'archive-icon' }),
  Wrench: (props: any) => React.createElement('svg', { ...props, 'data-testid': 'wrench-icon' }),
  Star: (props: any) => React.createElement('svg', { ...props, 'data-testid': 'star-icon' }),
  DollarSign: (props: any) =>
    React.createElement('svg', { ...props, 'data-testid': 'dollar-sign-icon' }),
  Users: (props: any) => React.createElement('svg', { ...props, 'data-testid': 'users-icon' }),
  TrendingUp: (props: any) =>
    React.createElement('svg', { ...props, 'data-testid': 'trending-up-icon' }),
  BarChart3: (props: any) =>
    React.createElement('svg', { ...props, 'data-testid': 'bar-chart-3-icon' }),
  PiggyBank: (props: any) =>
    React.createElement('svg', { ...props, 'data-testid': 'piggy-bank-icon' }),
  LucideIcon: (props: any) =>
    React.createElement('svg', { ...props, 'data-testid': 'lucide-icon' }),
}))

const originalConsoleError = console.error

// Suppress jsdom's unimplemented navigation error that fires when links are clicked in tests
console.error = (...args: any[]) => {
  const message = args[0]?.message ?? args[0]

  if (
    typeof message === 'string' &&
    message.includes('Not implemented: navigation (except hash changes)')
  ) {
    return
  }

  originalConsoleError(...args)
}
