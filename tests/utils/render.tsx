import { render, RenderOptions } from '@testing-library/react'
import { ReactElement } from 'react'

/**
 * Custom render function that wraps components with necessary providers
 * Use this instead of @testing-library/react's render for component tests
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  // For now, we don't have any providers (like theme, router, etc.)
  // This wrapper is here for future use when we add context providers

  return render(ui, { ...options })
}

// Re-export everything from @testing-library/react
export * from '@testing-library/react'
