import {
  pageVariants,
  cardHoverVariants,
  buttonHoverVariants,
  fadeInVariants,
  staggerContainerVariants,
  staggerItemVariants,
  expandableCardVariants,
} from './variants'

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
      const visible = pageVariants.visible as any
      expect(visible.transition).toBeDefined()
      expect(visible.transition.duration).toBe(0.4)
      expect(visible.transition.ease).toBe('easeOut')
      expect(visible.transition.staggerChildren).toBe(0.1)
    })

    it('has exit state with fade out and upward movement', () => {
      const exit = pageVariants.exit as any
      expect(exit.opacity).toBe(0)
      expect(exit.y).toBe(-20)
      expect(exit.transition.duration).toBe(0.3)
      expect(exit.transition.ease).toBe('easeIn')
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
      const hover = cardHoverVariants.hover as any
      expect(hover.scale).toBe(1.02)
      expect(hover.transition.duration).toBe(0.2)
      expect(hover.transition.ease).toBe('easeInOut')
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
      const hover = buttonHoverVariants.hover as any
      expect(hover.scale).toBe(1.05)
      expect(hover.transition.duration).toBe(0.15)
      expect(hover.transition.ease).toBe('easeOut')
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
      const visible = fadeInVariants.visible as any
      expect(visible.opacity).toBe(1)
      expect(visible.y).toBe(0)
      expect(visible.transition.duration).toBe(0.5)
      expect(visible.transition.ease).toBe('easeOut')
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
      const visible = staggerContainerVariants.visible as any
      expect(visible.opacity).toBe(1)
      expect(visible.transition.staggerChildren).toBe(0.1)
      expect(visible.transition.delayChildren).toBe(0.2)
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
      const visible = staggerItemVariants.visible as any
      expect(visible.opacity).toBe(1)
      expect(visible.y).toBe(0)
      expect(visible.transition.duration).toBe(0.4)
      expect(visible.transition.ease).toBe('easeOut')
    })
  })

  describe('expandableCardVariants', () => {
    it('exports expandable card variant object', () => {
      expect(expandableCardVariants).toBeDefined()
      expect(typeof expandableCardVariants).toBe('object')
    })

    it('has collapsed state with height 0 and opacity 0', () => {
      const collapsed = expandableCardVariants.collapsed as any
      expect(collapsed.height).toBe(0)
      expect(collapsed.opacity).toBe(0)
      expect(collapsed.overflow).toBe('hidden')
    })

    it('has transition configuration for collapsed state', () => {
      const collapsed = expandableCardVariants.collapsed as any
      expect(collapsed.transition.height.duration).toBe(0.2)
      expect(collapsed.transition.height.ease).toBe('easeOut')
      expect(collapsed.transition.opacity.duration).toBe(0.15)
      expect(collapsed.transition.opacity.ease).toBe('easeOut')
    })

    it('has expanded state with auto height and full opacity', () => {
      const expanded = expandableCardVariants.expanded as any
      expect(expanded.height).toBe('auto')
      expect(expanded.opacity).toBe(1)
      expect(expanded.overflow).toBe('visible')
    })

    it('has transition configuration for expanded state', () => {
      const expanded = expandableCardVariants.expanded as any
      expect(expanded.transition.height.duration).toBe(0.2)
      expect(expanded.transition.height.ease).toBe('easeOut')
      expect(expanded.transition.opacity.duration).toBe(0.2)
      expect(expanded.transition.opacity.ease).toBe('easeOut')
      expect(expanded.transition.opacity.delay).toBe(0.05)
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
      expect((pageVariants.hidden as any).opacity).toBe(0)
      expect((pageVariants.visible as any).opacity).toBe(1)
      expect((fadeInVariants.hidden as any).opacity).toBe(0)
      expect((fadeInVariants.visible as any).opacity).toBe(1)
      expect((staggerItemVariants.hidden as any).opacity).toBe(0)
      expect((staggerItemVariants.visible as any).opacity).toBe(1)
    })

    it('scale transitions are reasonable for UI elements', () => {
      expect((cardHoverVariants.rest as any).scale).toBe(1)
      expect((cardHoverVariants.hover as any).scale).toBe(1.02)
      expect((buttonHoverVariants.rest as any).scale).toBe(1)
      expect((buttonHoverVariants.hover as any).scale).toBe(1.05)
      expect((buttonHoverVariants.tap as any).scale).toBe(0.95)
    })

    it('duration values are reasonable for smooth animations', () => {
      expect((pageVariants.visible as any).transition.duration).toBeLessThanOrEqual(0.5)
      expect((cardHoverVariants.hover as any).transition.duration).toBeLessThanOrEqual(0.5)
      expect((buttonHoverVariants.hover as any).transition.duration).toBeLessThanOrEqual(0.5)
      expect((fadeInVariants.visible as any).transition.duration).toBeLessThanOrEqual(0.5)
    })
  })
})
