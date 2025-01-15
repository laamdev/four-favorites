import { ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface PageSummaryProps {
  children: ReactNode
  size?: 'default' | 'lg'
  className?: string
}

export const PageSummary = ({
  children,
  className,
  size
}: PageSummaryProps) => {
  return (
    <div
      className={cn(
        'mt-2 max-w-2xl text-sm text-zinc-400 sm:mt-4 sm:text-base',
        size === 'lg' ? 'text-base md:text-lg' : 'text-sm md:text-base',

        className
      )}
    >
      {children}
    </div>
  )
}
