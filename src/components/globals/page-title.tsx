import { ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface PageTitleProps {
  children: ReactNode
  size?: 'default' | 'lg'
  className?: string
}

export const PageTitle = ({
  children,
  className,
  size = 'default'
}: PageTitleProps) => {
  return (
    <h1
      className={cn(
        'max-w-5xl font-serif font-bold uppercase',
        size === 'lg' ? 'text-5xl md:text-7xl' : 'text-2xl md:text-5xl',
        className
      )}
    >
      {children}
    </h1>
  )
}
