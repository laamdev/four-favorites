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
        'max-w-5xl break-words font-serif text-3xl font-bold uppercase sm:text-5xl',
        className
      )}
    >
      {children}
    </h1>
  )
}
