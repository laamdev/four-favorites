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
        'max-w-2xl font-serif text-7xl font-bold uppercase leading-none',
        className
      )}
    >
      {children}
    </h1>
  )
}
