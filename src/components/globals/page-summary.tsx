import { ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface PageSummaryProps {
  children: ReactNode
  className?: string
}

export const PageSummary = ({ children, className }: PageSummaryProps) => {
  return (
    <div
      className={cn(
        'mt-2 max-w-2xl text-base text-zinc-400 sm:mt-4 md:text-lg',

        className
      )}
    >
      {children}
    </div>
  )
}
