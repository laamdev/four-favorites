import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  text: string
  className?: string
}

export const SectionHeading = ({ text, className }: SectionHeadingProps) => {
  return (
    <h2
      className={cn('font-serif text-3xl font-semibold uppercase', className)}
    >
      {text}
    </h2>
  )
}
