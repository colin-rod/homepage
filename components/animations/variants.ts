/**
 * Shared animation variants for Framer Motion
 * Centralized animation configurations for consistency across the site
 */

import { Variants } from 'framer-motion'

/**
 * Page transition variants
 * Used for animating page entries with fade + slide up
 */
export const pageVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: 'easeIn',
    },
  },
}

/**
 * Card hover variants
 * Subtle scale + shadow elevation
 */
export const cardHoverVariants: Variants = {
  rest: {
    scale: 1,
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: 'easeInOut',
    },
  },
}

/**
 * Button hover variants
 * More pronounced scale for interactive elements
 */
export const buttonHoverVariants: Variants = {
  rest: {
    scale: 1,
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.15,
      ease: 'easeOut',
    },
  },
  tap: {
    scale: 0.95,
  },
}

/**
 * Fade in variants for scroll-triggered animations
 * Animates elements as they come into viewport
 */
export const fadeInVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
}

/**
 * Stagger container variant
 * For animating lists of items with delay
 */
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

/**
 * Stagger item variant
 * Individual items within a stagger container
 */
export const staggerItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
}

/**
 * Expandable card variants
 * For expand/collapse animations in CV role cards
 * Smooth height transition with opacity fade
 */
export const expandableCardVariants: Variants = {
  collapsed: {
    height: 0,
    opacity: 0,
    overflow: 'hidden',
    transition: {
      height: {
        duration: 0.2,
        ease: 'easeOut',
      },
      opacity: {
        duration: 0.15,
        ease: 'easeOut',
      },
    },
  },
  expanded: {
    height: 'auto',
    opacity: 1,
    overflow: 'visible',
    transition: {
      height: {
        duration: 0.2,
        ease: 'easeOut',
      },
      opacity: {
        duration: 0.2,
        ease: 'easeOut',
        delay: 0.05,
      },
    },
  },
}
