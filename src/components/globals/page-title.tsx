import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface PageTitleProps {
  children: ReactNode
  className?: string
}

export const PageTitle = ({ children, className }: PageTitleProps) => {
  return (
    <h1
      className={cn(
        'max-w-3xl font-serif text-5xl font-bold uppercase md:text-7xl',
        className
      )}
    >
      {children}
    </h1>
  )
}
