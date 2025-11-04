import type { TargetAndTransition, Transition, Variant } from 'framer-motion'
import {
  pageVariants,
  cardHoverVariants,
  buttonHoverVariants,
  fadeInVariants,
  staggerContainerVariants,
  staggerItemVariants,
  expandableCardVariants,
} from './variants'

type TransitionRecord = Transition & Record<string, unknown>

const ensureVariantObject = (variant: Variant): TargetAndTransition => {
  if (typeof variant === 'function') {
    throw new Error('Expected static variant object')
  }
  if (!variant) {
    throw new Error('Expected variant object')
  }
  return variant
}

const ensureTransitionObject = (variant: TargetAndTransition): Transition => {
  const { transition } = variant
  if (!transition || Array.isArray(transition)) {
    throw new Error('Expected transition object')
  }
  return transition
}

const getTransitionSegment = (transition: Transition, key: string): Record<string, unknown> => {
  const record = transition as TransitionRecord
  const segment = record[key]
  if (typeof segment !== 'object' || segment === null) {
    throw new Error(`Expected transition.${key} to be an object`)
  }
  return segment as Record<string, unknown>
}

describe('Animation Variants', () => {
  describe('pageVariants', () => {
    it('exports page variant object', () => {
      expect(pageVariants).toBeDefined()
      expect(typeof pageVariants).toBe('object')
    })

    it('has hidden state with opacity and y offset', () => {
      expect(pageVariants.hidden).toEqual({
        opacity: 0,
        y: 20,
      })
    })

    it('has visible state with full opacity and no offset', () => {
      expect(pageVariants.visible).toHaveProperty('opacity', 1)
      expect(pageVariants.visible).toHaveProperty('y', 0)
    })

    it('has transition configuration in visible state', () => {
      const visible = ensureVariantObject(pageVariants.visible)
      const transition = ensureTransitionObject(visible)
      expect(transition.duration).toBe(0.4)
      expect(transition.ease).toBe('easeOut')
      expect(transition.staggerChildren).toBe(0.1)
    })

    it('has exit state with fade out and upward movement', () => {
      const exit = ensureVariantObject(pageVariants.exit)
      const transition = ensureTransitionObject(exit)
      expect(exit.opacity).toBe(0)
      expect(exit.y).toBe(-20)
      expect(transition.duration).toBe(0.3)
      expect(transition.ease).toBe('easeIn')
    })
  })

  describe('cardHoverVariants', () => {
    it('exports card hover variant object', () => {
      expect(cardHoverVariants).toBeDefined()
      expect(typeof cardHoverVariants).toBe('object')
    })

    it('has rest state with scale 1', () => {
      expect(cardHoverVariants.rest).toEqual({
        scale: 1,
      })
    })

    it('has hover state with slight scale increase', () => {
      const hover = ensureVariantObject(cardHoverVariants.hover)
      const transition = ensureTransitionObject(hover)
      expect(hover.scale).toBe(1.02)
      expect(transition.duration).toBe(0.2)
      expect(transition.ease).toBe('easeInOut')
    })
  })

  describe('buttonHoverVariants', () => {
    it('exports button hover variant object', () => {
      expect(buttonHoverVariants).toBeDefined()
      expect(typeof buttonHoverVariants).toBe('object')
    })

    it('has rest state with scale 1', () => {
      expect(buttonHoverVariants.rest).toEqual({
        scale: 1,
      })
    })

    it('has hover state with more pronounced scale', () => {
      const hover = ensureVariantObject(buttonHoverVariants.hover)
      const transition = ensureTransitionObject(hover)
      expect(hover.scale).toBe(1.05)
      expect(transition.duration).toBe(0.15)
      expect(transition.ease).toBe('easeOut')
    })

    it('has tap state with scale reduction', () => {
      expect(buttonHoverVariants.tap).toEqual({
        scale: 0.95,
      })
    })
  })

  describe('fadeInVariants', () => {
    it('exports fade in variant object', () => {
      expect(fadeInVariants).toBeDefined()
      expect(typeof fadeInVariants).toBe('object')
    })

    it('has hidden state with opacity 0 and y offset', () => {
      expect(fadeInVariants.hidden).toEqual({
        opacity: 0,
        y: 40,
      })
    })

    it('has visible state with full opacity and no offset', () => {
      const visible = ensureVariantObject(fadeInVariants.visible)
      const transition = ensureTransitionObject(visible)
      expect(visible.opacity).toBe(1)
      expect(visible.y).toBe(0)
      expect(transition.duration).toBe(0.5)
      expect(transition.ease).toBe('easeOut')
    })
  })

  describe('staggerContainerVariants', () => {
    it('exports stagger container variant object', () => {
      expect(staggerContainerVariants).toBeDefined()
      expect(typeof staggerContainerVariants).toBe('object')
    })

    it('has hidden state with opacity 0', () => {
      expect(staggerContainerVariants.hidden).toEqual({
        opacity: 0,
      })
    })

    it('has visible state with stagger configuration', () => {
      const visible = ensureVariantObject(staggerContainerVariants.visible)
      const transition = ensureTransitionObject(visible)
      expect(visible.opacity).toBe(1)
      expect(transition.staggerChildren).toBe(0.1)
      expect(transition.delayChildren).toBe(0.2)
    })
  })

  describe('staggerItemVariants', () => {
    it('exports stagger item variant object', () => {
      expect(staggerItemVariants).toBeDefined()
      expect(typeof staggerItemVariants).toBe('object')
    })

    it('has hidden state with opacity and y offset', () => {
      expect(staggerItemVariants.hidden).toEqual({
        opacity: 0,
        y: 20,
      })
    })

    it('has visible state with full opacity and no offset', () => {
      const visible = ensureVariantObject(staggerItemVariants.visible)
      const transition = ensureTransitionObject(visible)
      expect(visible.opacity).toBe(1)
      expect(visible.y).toBe(0)
      expect(transition.duration).toBe(0.4)
      expect(transition.ease).toBe('easeOut')
    })
  })

  describe('expandableCardVariants', () => {
    it('exports expandable card variant object', () => {
      expect(expandableCardVariants).toBeDefined()
      expect(typeof expandableCardVariants).toBe('object')
    })

    it('has collapsed state with height 0 and opacity 0', () => {
      const collapsed = ensureVariantObject(expandableCardVariants.collapsed)
      expect(collapsed.height).toBe(0)
      expect(collapsed.opacity).toBe(0)
      expect(collapsed.overflow).toBe('hidden')
    })

    it('has transition configuration for collapsed state', () => {
      const collapsed = ensureVariantObject(expandableCardVariants.collapsed)
      const transition = ensureTransitionObject(collapsed)
      const heightTransition = getTransitionSegment(transition, 'height')
      const opacityTransition = getTransitionSegment(transition, 'opacity')
      expect(heightTransition).toMatchObject({ duration: 0.2, ease: 'easeOut' })
      expect(opacityTransition).toMatchObject({ duration: 0.15, ease: 'easeOut' })
    })

    it('has expanded state with auto height and full opacity', () => {
      const expanded = ensureVariantObject(expandableCardVariants.expanded)
      expect(expanded.height).toBe('auto')
      expect(expanded.opacity).toBe(1)
      expect(expanded.overflow).toBe('visible')
    })

    it('has transition configuration for expanded state', () => {
      const expanded = ensureVariantObject(expandableCardVariants.expanded)
      const transition = ensureTransitionObject(expanded)
      const heightTransition = getTransitionSegment(transition, 'height')
      const opacityTransition = getTransitionSegment(transition, 'opacity')
      expect(heightTransition).toMatchObject({ duration: 0.2, ease: 'easeOut' })
      expect(opacityTransition).toMatchObject({
        duration: 0.2,
        ease: 'easeOut',
        delay: 0.05,
      })
    })
  })

  describe('Variant consistency', () => {
    it('all variants have required state keys', () => {
      expect(pageVariants).toHaveProperty('hidden')
      expect(pageVariants).toHaveProperty('visible')
      expect(cardHoverVariants).toHaveProperty('rest')
      expect(cardHoverVariants).toHaveProperty('hover')
      expect(buttonHoverVariants).toHaveProperty('rest')
      expect(buttonHoverVariants).toHaveProperty('hover')
      expect(fadeInVariants).toHaveProperty('hidden')
      expect(fadeInVariants).toHaveProperty('visible')
      expect(staggerContainerVariants).toHaveProperty('hidden')
      expect(staggerContainerVariants).toHaveProperty('visible')
      expect(staggerItemVariants).toHaveProperty('hidden')
      expect(staggerItemVariants).toHaveProperty('visible')
      expect(expandableCardVariants).toHaveProperty('collapsed')
      expect(expandableCardVariants).toHaveProperty('expanded')
    })

    it('opacity transitions go from 0 to 1 for fade effects', () => {
      expect(ensureVariantObject(pageVariants.hidden).opacity).toBe(0)
      expect(ensureVariantObject(pageVariants.visible).opacity).toBe(1)
      expect(ensureVariantObject(fadeInVariants.hidden).opacity).toBe(0)
      expect(ensureVariantObject(fadeInVariants.visible).opacity).toBe(1)
      expect(ensureVariantObject(staggerItemVariants.hidden).opacity).toBe(0)
      expect(ensureVariantObject(staggerItemVariants.visible).opacity).toBe(1)
    })

    it('scale transitions are reasonable for UI elements', () => {
      expect(ensureVariantObject(cardHoverVariants.rest).scale).toBe(1)
      expect(ensureVariantObject(cardHoverVariants.hover).scale).toBe(1.02)
      expect(ensureVariantObject(buttonHoverVariants.rest).scale).toBe(1)
      expect(ensureVariantObject(buttonHoverVariants.hover).scale).toBe(1.05)
      expect(ensureVariantObject(buttonHoverVariants.tap).scale).toBe(0.95)
    })

    it('duration values are reasonable for smooth animations', () => {
      const pageVisibleTransition = ensureTransitionObject(
        ensureVariantObject(pageVariants.visible)
      )
      const cardHoverTransition = ensureTransitionObject(
        ensureVariantObject(cardHoverVariants.hover)
      )
      const buttonHoverTransition = ensureTransitionObject(
        ensureVariantObject(buttonHoverVariants.hover)
      )
      const fadeInTransition = ensureTransitionObject(ensureVariantObject(fadeInVariants.visible))

      expect(pageVisibleTransition.duration).toBeLessThanOrEqual(0.5)
      expect(cardHoverTransition.duration).toBeLessThanOrEqual(0.5)
      expect(buttonHoverTransition.duration).toBeLessThanOrEqual(0.5)
      expect(fadeInTransition.duration).toBeLessThanOrEqual(0.5)
    })
  })
})
