import { ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface PageTitleProps {
  children: ReactNode
  className?: string
}

export const PageTitle = ({ children, className }: PageTitleProps) => {
  return (
    <h1
      className={cn(
        'max-w-3xl font-serif text-4xl font-bold uppercase md:text-7xl',
        className
      )}
    >
      {children}
    </h1>
  )
}
