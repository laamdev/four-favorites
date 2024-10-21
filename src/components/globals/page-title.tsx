import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface PageTitleProps {
  children: ReactNode
  className?: string
}

export const PageTitle = ({ children, className }: PageTitleProps) => {
  return (
    <h1 className={cn('text-7xl leading-none uppercase font-bold font-serif max-w-2xl', className)}>
      {children}
    </h1>
  )
}
