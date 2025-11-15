import { ElementType, ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'

type PageHeaderProps<T extends ElementType = 'header'> = {
  as?: T
  className?: string
} & ComponentPropsWithoutRef<T>

export default function PageHeader<T extends ElementType = 'header'>({
  as,
  className,
  ...props
}: PageHeaderProps<T>) {
  const Component = as ?? 'header'

  return <Component className={cn('mx-auto max-w-4xl px-6 lg:px-8', className)} {...props} />
}
