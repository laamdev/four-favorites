import { ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface PageTitleProps {
  children: ReactNode
  size?: 'default' | 'lg'
  className?: string
}

export const PageTitle = ({ children, className }: PageTitleProps) => {
  return (
    <h1
      className={cn(
        'max-w-5xl break-words font-serif text-5xl font-bold uppercase md:text-8xl',
        className
      )}
    >
      {children}
    </h1>
  )
}
