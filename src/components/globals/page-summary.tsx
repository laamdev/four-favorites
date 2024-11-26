import { cn } from '@/lib/utils'

interface PageSummaryProps {
  children: React.ReactNode
  className?: string
}

export const PageSummary = ({ children, className }: PageSummaryProps) => {
  return (
    <p
      className={cn(
        'prose mt-2 max-w-2xl text-base text-zinc-300 sm:mt-4 sm:text-lg',
        className
      )}
    >
      {children}
    </p>
  )
}
