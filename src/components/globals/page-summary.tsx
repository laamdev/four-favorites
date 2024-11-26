import { cn } from '@/lib/utils'

interface PageSummaryProps {
  children: React.ReactNode
  className?: string
}

export const PageSummary = ({ children, className }: PageSummaryProps) => {
  return (
    <p className={cn('prose text-base text-zinc-300 sm:text-lg', className)}>
      {children}
    </p>
  )
}
