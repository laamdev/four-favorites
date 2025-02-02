import { cn } from '@/lib/utils'

interface SectionWrapperProps {
  children: React.ReactNode
  className?: string
}

export const SectionWrapper = ({
  children,
  className
}: SectionWrapperProps) => {
  return (
    <section className={cn('relative py-12 sm:py-16', className)}>
      {children}
    </section>
  )
}
