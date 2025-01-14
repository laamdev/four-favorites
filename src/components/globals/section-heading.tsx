import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  text: string
  className?: string
}

export const SectionHeading = ({ text, className }: SectionHeadingProps) => {
  return (
    <h2
      className={cn(
        'font-serif text-xl font-semibold uppercase sm:text-3xl',
        className
      )}
    >
      {text}
    </h2>
  )
}
